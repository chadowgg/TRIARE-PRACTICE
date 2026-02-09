import { IsNotEmpty, IsString, MinLength, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Коментар не може бути порожнім' })
  postComment: string;

  @IsInt()
  postId: number;
}
