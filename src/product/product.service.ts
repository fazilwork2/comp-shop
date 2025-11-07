import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { name } = createProductDto;
    const nameChek = await this.prisma.product.findFirst({ where: { name } });
    if (nameChek) {
      throw new BadRequestException('such a name is already exist');
    }
    const Product = await this.prisma.product.create({
      data: createProductDto as Prisma.ProductCreateInput,
    });
    return { message: 'product created', Product };
  }

  async findAll(page: number, limit: number,maxPrice:number,minPrice:number) {
    const products = await this.prisma.product.findMany({
      skip: page,
      take: limit,
      where: {
        ...(minPrice && { price: { gte: minPrice } }),
        ...(maxPrice && { price: { lte: maxPrice } }),
      },
    });

    if (products.length < 1) {
      console.log(products);
    }

    return {
      data: products,
    };
  }

  async findOne(id: string) {
    const Product = await this.prisma.product.findFirst({ where: { id: id } });

    if (!Product) {
      throw new BadRequestException('product is not found');
    }

    return { message: 'product is found', Product };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { name, stock, category, price, description } = updateProductDto;
    const Product = await this.prisma.product.findFirst({ where: { id: id } });

    if (!Product) {
      throw new BadRequestException('product is not found');
    }

    const updateProduct = await this.prisma.product.update({
      where: { id: id },
      data: {
        name: name,
        stock: stock,
        category: category as any,
        price: price,
        description: description,
      },
    });

    return { message: 'product updated good', updateProduct };
  }

  async remove(id: string) {
    const Product = await this.prisma.product.findFirst({ where: { id: id } });

    if (!Product) {
      throw new BadRequestException('product is not found');
    }

    await this.prisma.product.delete({ where: { id: id } });

    return { message: 'product is deleted' };
  }
}
