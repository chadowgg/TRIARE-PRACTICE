import { IsInt, IsIn } from 'class-validator';

export class VoteCommentDto {
  @IsInt()
  @IsIn([1, -1], { message: 'Value повинно бути 1 (лайк) або -1 (дизлайк)' })
  value: number;
}