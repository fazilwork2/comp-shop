import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/RegisterDto';
import express from 'express';
import { AuthGuard } from './authMiddleware';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/update-authentication.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка при регистрации (например, email уже существует)',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Вход в систему (возвращает токен и устанавливает cookie)',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Успешный вход' })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authenticationService.Login(dto, res as any);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Получить информацию о текущем пользователе (по токену)',
  })
  @ApiBearerAuth() // ← добавляем поддержку JWT в Swagger UI
  @ApiResponse({ status: 200, description: 'Профиль текущего пользователя' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @UseGuards(AuthGuard)
  getProfile(@Req() req: express.Request) {
    return this.authenticationService.profile(req);
  }
}
