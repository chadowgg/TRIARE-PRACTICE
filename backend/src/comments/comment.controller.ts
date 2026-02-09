import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationCommentDto } from './dto/pagination.comment.dto';
import { VoteCommentDto } from './dto/vote.comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: { user: { id?: number } },
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Користувача не знайдено в токені');
    }

    return this.commentService.createComment(userId, createCommentDto);
  }

  @Get('post/:postId')
  async getAllCommentsPost(
    @Param('postId') postId: number,
    @Query() paginationCommentDto: PaginationCommentDto,
  ) {
    return this.commentService.getCommentByPost(
      postId,
      paginationCommentDto.page,
      paginationCommentDto.limit,
    );
  }

  @Patch(':commentId')
  @UseGuards(JwtAuthGuard)
  async patchComment(
    @Req() req: { user: { id?: number } },
    @Param('commentId') commentId: string,
    @Body('post_comment') postComment: string,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Користувача не знайдено в токені');
    }

    return this.commentService.updateComment(userId, +commentId, postComment);
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Req() req: { user: { id?: number } },
    @Param('commentId') commentId: string,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Користувача не знайдено в токені');
    }

    return this.commentService.deleteComment(userId, +commentId);
  }

  @Patch(':commentId/vote')
  @UseGuards(JwtAuthGuard)
  async voteComment(
    @Req() req: { user: { id?: number } },
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() voteDto: VoteCommentDto,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Користувача не знайдено в токені');
    }

    console.log('Прийшло значення value:', voteDto.value);

    return this.commentService.vote(userId, commentId, voteDto.value);
  }
}
