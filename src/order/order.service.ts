import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Создать заказ
  async create(req: Request, dto: CreateOrderDto) {
    const access_token = req.cookies.access_token;
    const userchek = await this.jwtService.verifyAsync(
      access_token,
      process.env.SECRET_KEY_FOR_TOKEN as JwtVerifyOptions,
    );

    const user = await this.prisma.user.findFirst({
      where: { id: userchek.id },
    });

    const itemsData: { productId: string; quantity: number; price: number }[] = [];
    let total = 0;

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product)
        throw new NotFoundException(`Product ${item.productId} not found`);

      if (product.stock < item.quantity)
        throw new ForbiddenException(`Not enough stock for ${product.name}`);

      total += product.price * item.quantity;

      itemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity },
      });
    }

    return this.prisma.order.create({
      data: {
        userId: user?.id as string,
        total,
        Status: 'pending',
        items: {
          create: itemsData,
        },
      },
      include: { items: true },
    });
  }

  // Получить свои заказы
  async findMine(req: Request) {
    const access_token = req.cookies.access_token;
    const userchek = await this.jwtService.verifyAsync(
      access_token,
      process.env.SECRET_KEY_FOR_TOKEN as JwtVerifyOptions,
    );


    
    return this.prisma.order.findMany({
      where: {userId:userchek.id},
      include: { items: true },
    });
  }

  // Получить детали заказа по id (только владелец или админ)
  async findOne(req: Request, orderId: string) {
    const access_token = req.cookies.access_token;
    const userchek = await this.jwtService.verifyAsync(
      access_token,
      process.env.SECRET_KEY_FOR_TOKEN as JwtVerifyOptions,
    );
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userchek.id) throw new ForbiddenException('Access denied');
    return order;
  }

  // Админ: обновить статус заказа
  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { Status: dto.status },
      include: { items: true, user: true },
    });
  }
}
