import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create.post.dto';
import { PaginationPostDto } from './dto/pagination.post.dto';
import { GetPostsQueryDto } from './dto/get.post.query.dto';
import { RequestWithUser } from './dto/request.user.dto';
import { UpdatePostDto } from './dto/update.post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Req() req: { user: { id?: number } },
    @Body() createPostDto: CreatePostDto,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Користувача не знайдено в токені');
    }

    return this.postsService.createPost(userId, createPostDto);
  }

  @Get(':id')
  async getPost(@Param('id') id: number) {
    return this.postsService.getPostById(+id);
  }

  @Get('user/:userId')
  async getPostByUser(
    @Param('userId') userId: number,
    @Query() paginationPostDto: PaginationPostDto,
  ) {
    return this.postsService.getPostsByUser(
      userId,
      paginationPostDto.page,
      paginationPostDto.limit,
    );
  }

  @Get()
  async getAllPostsExcludeUserId(@Query() queryDto: GetPostsQueryDto) {
    return this.postsService.getAllPostsExcludeUserId(
      queryDto.page,
      queryDto.limit,
      queryDto.excludeUserId,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: { user: { id?: number } },
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Користувача не знайдено в токені');
    }

    return this.postsService.updatePost(id, userId, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('id') id: number, @Req() req: RequestWithUser) {
    const user = req.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('Ви не авторизовані для цієї дії');
    }
    return this.postsService.deletePostById(id, user.id);
  }
}
