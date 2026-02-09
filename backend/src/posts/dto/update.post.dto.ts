import { CreatePostDto } from './create.post.dto';
import { PartialType } from '@nestjs/mapped-types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdatePostDto extends PartialType(CreatePostDto) {}
