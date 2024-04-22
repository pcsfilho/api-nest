import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/log.interceptor';

// Método bootstrap responsável pela primeira chamada da aplicação
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // cria uma aplicação express com design factory
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LogInterceptor());
  await app.listen(3000);
}
bootstrap();
