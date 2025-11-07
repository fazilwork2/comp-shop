import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, Length, Max, Min } from "class-validator";

export class CreateProductDto {
    @Length(3,30)
    @ApiProperty({ example: 'iPhone 15 Pro', description: 'Название товара' })
    name:string
    @IsIn(['laptop', 'desktop', 'accessory']) 
    @ApiProperty({ example: 'desktop', description: 'Категория товара' })
    category: string;
    @Length(70,500)
    @ApiProperty({ example: 'iPhone — это больше чем смартфон, это символ инноваций и безупречного дизайна. Он сочетает мощный процессорльзования. С каждым поколением iPhone переопределяет стандарты, предлагая премиальные материалы, вседневную автономность и передовые функции, делая его универсальным инструментом для работы, творчества и общения', description: 'Описание товара'})
    description:string
    @IsNumber()
    @Min(0)
    @Max(1000000) 
    @ApiProperty({ example: 1200, description: 'Цена товара максимум 1000000' })
    price: number;
    @Min(0)
    @Max(600)
    @ApiProperty({ example: 120, description: 'количество товара' })
    stock: number
}


