import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './security/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ¡ESTA ES LA LÍNEA MÁGICA QUE AGREGA /api A TODAS LAS RUTAS!
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Lee el puerto 8082 de tu .env
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();