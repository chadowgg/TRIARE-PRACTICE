import { Post } from '../entities/post.entity';

export class PaginatedPostsResponseDto {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
