import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsModule } from './tickets/tickets.module';
import { Ticket } from './tickets/entities/ticket.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'postgres',
        password: 'Admin123',
        database: 'tickets_db',
        entities: [Ticket],
        synchronize: true, 
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TicketsModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}