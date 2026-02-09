import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PostsModule } from '../posts/posts.module';
import { CommentVote } from './entities/comment-vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentVote]),
    forwardRef(() => PostsModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentsModule {}
