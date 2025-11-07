import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: Status,
    description: 'Новый статус заказа',
    example: Status.pending,
  })
  @IsEnum(Status)
  status: Status;
}
