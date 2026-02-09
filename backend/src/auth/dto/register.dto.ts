import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Невірний формат email' })
  @IsNotEmpty({ message: "Email обов'язковий" })
  email: string;

  @IsNotEmpty({ message: "Пароль обов'язковий" })
  @MinLength(6, { message: 'Пароль має мінімум 6 символів' })
  password: string;

  @IsNotEmpty({ message: "Ім'я обов'язкове" })
  @MinLength(2, { message: "Ім'я має містити мінімум 2 символів" })
  name: string;
}
