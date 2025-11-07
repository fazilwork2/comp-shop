import { Controller, Post, Body, Req, Get, Param, Put, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { AuthGuard } from '../authentication/authMiddleware';
import { AdminGuard } from '../roles.guard';
import express from 'express';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';


@Controller('api')
export class OrderController {
  constructor(private orderService: OrderService) {}

  // Создать заказ (customer)
  @Post("orders")
  @ApiOperation({ summary: 'Создать новый заказ' })
  @ApiResponse({ status: 201, description: 'Заказ успешно создан' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  @UseGuards(AuthGuard)
  create(@Req() req:express.Request, @Body() dto: CreateOrderDto) {
    return this.orderService.create(req,dto);
  }

  // Список своих заказов
  @UseGuards(AuthGuard)
  @Get("orders")
  @ApiOperation({ summary: 'Получить список своих заказов' })
  @ApiResponse({ status: 200, description: 'Список заказов получен' })
  findMine(@Req() req: express.Request) {
    return this.orderService.findMine(req);
  }

  // Детали заказа по id
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Получить детали заказа по ID' })
  @ApiParam({ name: 'id', description: 'ID заказа', example: 'a1b2c3d4' })
  @ApiResponse({ status: 200, description: 'Детали заказа получены' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @Get('orders/:id')
  findOne(@Req() req: express.Request,  @Param('id') id: string) {
    return this.orderService.findOne(req, id);
  }

  // Админ: изменить статус заказа
  @UseGuards(AuthGuard, AdminGuard)
  @Put('orders/:id/status')
  @ApiOperation({ summary: 'Изменить статус заказа (только для админа)' })
  @ApiParam({ name: 'id', description: 'ID заказа', example: 'a1b2c3d4' })
  @ApiResponse({ status: 200, description: 'Статус заказа обновлён' })
  @ApiResponse({ status: 403, description: 'Нет прав доступа' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto);
  }
}
