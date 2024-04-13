import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Método bootstrap responsável pela primeira chamada da aplicação
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // cria uma aplicação express com design factory
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
