import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('comp shop')
    .setDescription('The comp shop API description')
    .setVersion('1.0')
    .addTag('shops')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:4001',
    credentials: true,
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(PORT + ' working');
  });
}
bootstrap();
