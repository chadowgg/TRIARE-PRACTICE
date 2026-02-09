import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';

@Entity()
@Unique(['user', 'comment'])
export class CommentVote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  value: number;

  @ManyToOne(() => Comment, (comment) => comment.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
