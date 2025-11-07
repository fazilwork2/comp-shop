import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new ForbiddenException('токен не найден');
    }

    try {        
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY_FOR_TOKEN,
      });
      
      
      if (decoded.role !== 'admin') {
          throw new ForbiddenException('только админ может это делать');
        }

      return true;
    } catch (err) {
      throw new ForbiddenException('токена нету или устарел');
    }
  }
}
