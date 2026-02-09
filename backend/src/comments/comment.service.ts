import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create.comment.dto';
import { PaginatedCommentsResponseDto } from './dto/paginated.comments.response.dto';
import { CommentVote } from './entities/comment-vote.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(CommentVote)
    private voteRepository: Repository<CommentVote>,
  ) {}

  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    const { postId, postComment } = createCommentDto;

    const comment = this.commentRepository.create({
      user_id: userId,
      post_id: postId,
      post_comment: postComment,
    });

    const saved = await this.commentRepository.save(comment);

    return this.commentRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }

  async getCommentByPost(
    postId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedCommentsResponseDto> {
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepository.findAndCount({
      skip,
      take: limit,
      where: { post: { id: postId } },
      relations: ['user'],
      order: { comment_like: 'DESC' },
    });

    return {
      data: comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    };
  }

  async updateComment(userId: number, commentId: number, postComment: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Коментар не знайдено');
    }

    if (comment.user_id !== userId) {
      throw new ForbiddenException('Ви не можете редагувати чужий коментар');
    }

    comment.post_comment = postComment;
    return await this.commentRepository.save(comment);
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Коментар не знайдено');
    if (comment.user_id !== userId)
      throw new ForbiddenException('Ви не можете видалити чужий коментар');

    await this.commentRepository.remove(comment);
    return { message: 'Коментар видалено' };
  }

  async getCommentById(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
    if (!comment) throw new NotFoundException('Коментар не знайдено');
    return comment;
  }

  async vote(userId: number, commentId: number, value: number) {
    let vote = await this.voteRepository.findOne({
      where: { user: { id: userId }, comment: { id: commentId } },
    });

    const comment = await this.commentRepository.findOneBy({ id: commentId });

    if (!comment) {
      throw new NotFoundException('Коментаря не існує');
    }

    if (vote) {
      if (vote.value === value) {
        comment.comment_like -= vote.value;
        await this.voteRepository.remove(vote);
      } else {
        comment.comment_like += value * 2;
        vote.value = value;
        await this.voteRepository.save(vote);
      }
    } else {
      vote = this.voteRepository.create({
        user: { id: userId },
        comment: { id: commentId },
        value: value,
      });
      comment.comment_like += value;
      await this.voteRepository.save(vote);
    }

    await this.commentRepository.save(comment);

    return comment;
  }
}
