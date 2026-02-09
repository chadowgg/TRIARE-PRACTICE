import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Невірний формат email' })
  @IsNotEmpty({ message: "Email обов'язковий" })
  email: string;

  @IsNotEmpty({ message: "Пароль обов'язковий" })
  password: string;
}
