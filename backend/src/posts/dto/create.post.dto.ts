import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Заголовок не може бути порожнім' })
  @IsString()
  @MaxLength(100, { message: 'Заголовок занадто довгий' })
  title: string;

  @IsNotEmpty({ message: 'Опис не може бути порожнім' })
  @IsString()
  @MinLength(10, { message: 'Опис має містити хоча б 10 символів' })
  description: string;
}
