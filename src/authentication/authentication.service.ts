import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import { PrismaService } from '../prisma/prisma.service';
import { Request, Response } from 'express';
import * as bcryp from 'bcrypt';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { LoginDto } from './dto/update-authentication.dto';



@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
) {}

  async register(registerDto: RegisterDto): Promise<object> {
    const { name, password, email } = registerDto;

    const chekEmail = await this.prisma.user.findUnique({
      where: {email},
    });

    if (chekEmail) {
      throw new BadRequestException("email is already exist");
    }

    const salt = Number(process.env.SALT);
    const hash = await bcryp.hash(password, salt);

    const user = await this.prisma.user.create({
      data: { name, email, password: hash },
    });

    return { message: 'user created', user };
  }

  async Login(logiinDto: LoginDto,res: Response) {
    const {password, email } = logiinDto;

    const user = await this.prisma.user.findUnique({where:{email}});

    if (!user) {
      throw new BadRequestException('user is not exist');
    }

    const chekPassword = await bcryp.compare(password, user.password);

    if (!chekPassword) {
      throw new BadRequestException('password is wrong');
    }



    await this.prisma.user.update({
      where: { email: email },
      data: { verify: true },
    });
    

 
    const payload = { id: user.id, username: user.name, role:user.role};
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.SECRET_KEY_FOR_TOKEN, 
      expiresIn: '7d', 
    });

    
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return {
      message: 'Login successful',
      access_token: accessToken,
    };
  }

async profile(req:Request ) {
  const access_token = req.cookies.access_token
  const userchek = await this.jwtService.verifyAsync(access_token,process.env.SECRET_KEY_FOR_TOKEN as JwtVerifyOptions)
  
  const user = await this.prisma.user.findFirst({where:{id:userchek.id}})

  if (!user) {
    throw new BadRequestException()
  }

  return user
}
}
