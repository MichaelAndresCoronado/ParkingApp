import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; 
import { HttpExceptionFilter } from './security/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas (ej: localhost:3000/api/vehiculos)
  app.setGlobalPrefix('api');

  // Validaciones estrictas de los DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // ---> AQUÍ AGREGAMOS EL FILTRO GLOBAL DE EXCEPCIONES <---
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();