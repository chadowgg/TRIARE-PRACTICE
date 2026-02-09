import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CommentsModule } from '../comments/comment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), forwardRef(() => CommentsModule)],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
