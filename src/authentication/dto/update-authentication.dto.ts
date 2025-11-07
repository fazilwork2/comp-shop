import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './RegisterDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Qwerty123!',
    description: 'Пароль пользователя',
  })
  @IsString()
  password: string;
}