import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PrismaModule } from '../prisma/PrismaModule';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY_FOR_TOKEN,
      signOptions: { expiresIn: '7d' },
    }),PrismaModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
