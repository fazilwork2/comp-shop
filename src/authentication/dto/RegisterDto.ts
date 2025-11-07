import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty({
    example: 'John Doe',
    description: 'Имя пользователя',
  })
  name: string;
  @ApiProperty({
    example: 'user@example.com',
    description: 'Электронная почта пользователя',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: 'Qwerty123!',
    description:
      'Надёжный пароль (минимум 10 символов, 1 заглавная, 1 строчная, 1 цифра и 1 специальный символ)',
  })
  @IsStrongPassword(
    {},
    {
      message:
        'Пароль должен быть не меньше 10 символов,содержать хотя бы одну заглавную букву, одну строчную, одну цифру и один специальный символ',
    },
  )
  password: string;
}
