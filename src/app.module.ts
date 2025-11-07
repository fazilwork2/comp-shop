import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaModule } from './prisma/PrismaModule';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';


@Module({
  imports:[AuthenticationModule,PrismaModule, ProductModule, OrderModule],  
  controllers: [],
  providers:[]
})
export class AppModule {}
