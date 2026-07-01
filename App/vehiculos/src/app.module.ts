import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { ConfigModule } from '@nestjs/config'; // <-- ¡para leer variables de entorno!
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Importa TypeORM
import { databaseConfig } from './config/database.conf'; // <-- Asegúrate de que la ruta sea correcta según tu carpeta config
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/jwt.strategy';


@Module({
  imports:[PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({ isGlobal: true }), // <-- ¡ESTO ES LO QUE FALTABA!
  TypeOrmModule.forRoot(databaseConfig), // <-- Agrega esta línea para configurar TypeORM con tu base de datos
  VehiculosModule],
  controllers: [AppController],
  providers: [JwtStrategy,AppService],
})
export class AppModule {}
