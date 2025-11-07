import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdminGuard } from '../roles.guard';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('api')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  @ApiOperation({ summary: 'Получить список товаров с фильтром по цене и пагинацией' })
  @ApiQuery({ name: 'page', required: false, example: 0, description: 'Смещение (начало выборки)' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Количество товаров для вывода' })
  @ApiQuery({ name: 'minPrice', required: false, example: 100, description: 'Минимальная цена' })
  @ApiQuery({ name: 'maxPrice', required: false, example: 1000, description: 'Максимальная цена' })

  findAll(
   @Query('page') page: any,
   @Query('limit') limit: any,
   @Query('maxPrice') maxPrice: any,
   @Query('minPrice') minPrice: any
  ) {
    return this.productService.findAll(+page,+limit,+maxPrice,+minPrice);
  }
  @Post('products')
  @ApiOperation({ summary: 'Создать новый товар (только админ)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Товар успешно создан' })
  @UseGuards(AdminGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Товар найден' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Put('products/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Обновить товар по ID (только админ)' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Товар обновлён' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete('products/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Удалить товар по ID (только админ)' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Товар удалён' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
