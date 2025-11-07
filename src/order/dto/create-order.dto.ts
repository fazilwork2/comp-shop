import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsArray } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 'prod_123abc',
    description: 'ID товара, который добавляется в заказ',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Количество единиц товара (минимум 1)',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
export class CreateOrderDto {
  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Массив товаров для создания заказа',
    example: [
      { productId: 'prod_123abc', quantity: 2 },
      { productId: 'prod_456def', quantity: 1 },
    ],
  })
  @IsArray()
  items: CreateOrderItemDto[];
}