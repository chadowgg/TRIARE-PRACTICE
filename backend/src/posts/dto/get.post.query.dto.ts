import { PaginationPostDto } from './pagination.post.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPostsQueryDto extends PaginationPostDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  excludeUserId?: number;
}
