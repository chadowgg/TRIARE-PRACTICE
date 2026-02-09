import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create.post.dto';
import { PaginatedPostsResponseDto } from './dto/paginated.posts.response.dto';
import { UpdatePostDto } from './dto/update.post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    const post = this.postRepository.create({
      userId,
      ...createPostDto,
    });
    return await this.postRepository.save(post);
  }

  async getPostsByUser(
    userId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedPostsResponseDto> {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      skip,
      take: limit,
      where: { userId },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    };
  }

  async getPostById(id: number) {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getAllPostsExcludeUserId(
    page: number,
    limit: number,
    excludeUserId?: number | null,
  ): Promise<PaginatedPostsResponseDto> {
    const skip = (page - 1) * limit;

    try {
      let query = this.postRepository.createQueryBuilder('post');

      if (excludeUserId) {
        query = query.where('post.userId != :userId', {
          userId: excludeUserId,
        });
      }

      const [posts, total] = await query
        .skip(skip)
        .take(limit)
        .leftJoinAndSelect('post.user', 'user')
        .getManyAndCount();

      return {
        data: posts,
        total,
        page,
        limit,
        totalPages: Math.ceil(Number(total) / limit),
      };
    } catch (error) {
      throw new Error('Не вдалося отримати пости', error);
    }
  }

  async updatePost(id: number, userId: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Пост не знайдено');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Ви не можете редагувати чужий пост');
    }

    await this.postRepository.update(id, updatePostDto);

    const updatedPost = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    return {
      message: 'Пост успішно редаговано',
      post: updatedPost,
    };
  }

  async deletePostById(postId: number, userId: number) {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Пост не знайдено');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Ви не можете видалити чужий пост');
    }

    await this.postRepository.delete(postId);

    return { message: 'Пост успішно видалено' };
  }
}
