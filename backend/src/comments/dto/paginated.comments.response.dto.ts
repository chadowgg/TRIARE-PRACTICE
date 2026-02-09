import { Comment} from '../entities/comment.entity';

export class PaginatedCommentsResponseDto {
  data: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
