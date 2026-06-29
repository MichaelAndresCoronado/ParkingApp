// import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
// import { TicketsService } from './tickets.service';
// import { CreateTicketDto } from './dto/create-ticket.dto';
// import { UpdateTicketDto } from './dto/update-ticket.dto';
// import { JwtAuthGuard } from '../security/jwt-auth.guard';
// import { RolesGuard } from '../security/roles.guard';
// import { Roles } from '../security/roles.decorator';

// @Controller('tickets')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class TicketsController {
//   constructor(private readonly ticketsService: TicketsService) {}

  
//   @Post()
//   create(@Body() createTicketDto: CreateTicketDto) {
//     return this.ticketsService.create(createTicketDto);
//   }
  
//   //reserva espacio
//   @Post('reservar/:idEspacio')
//   reservar(@Param('idEspacio') idEspacio: string) {
//   return this.ticketsService.reservarEspacio(idEspacio);
// }

//   @Get()
//   findAll() {
//     return this.ticketsService.findAll();
//   }

//   @Get('activos')
//   findActivos() {
//     return this.ticketsService.findActivos();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.ticketsService.findOne(id);
//   }

//   // CORRECCIÓN: Llamamos a cerrarTicket en lugar de update
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
//     return this.ticketsService.cerrarTicket(id, updateTicketDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.ticketsService.remove(id);
//   }
// }


import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';


// Importaciones de seguridad
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { RolesGuard } from '../security/roles.guard';
import { Roles } from '../security/roles.decorator';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard) // <-- Todos deben enviar token
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // CREAR TICKET PRESENCIAL (Entrada directa)
 @Post()
  @Roles('SUPER_ADMIN', 'OPERADOR')
  create(@Body() createTicketDto: CreateTicketDto, @Req() request: Request) {
    const authHeader = request.headers.authorization; // Atrapamos el token
    return this.ticketsService.create(createTicketDto, authHeader);
  }
  
  // RESERVAR ESPACIO (La lógica de los 5 minutos)
 @Post('reservar/:idEspacio')
  @Roles('SUPER_ADMIN', 'OPERADOR', 'CLIENTE')
  reservar(@Param('idEspacio') idEspacio: string, @Req() request: Request) {
    const authHeader = request.headers.authorization; // Atrapamos el token
    return this.ticketsService.reservarEspacio(idEspacio, authHeader);
  }

  // VER TODOS LOS TICKETS
  @Get()
  @Roles('SUPER_ADMIN', 'OPERADOR')
  findAll() {
    return this.ticketsService.findAll();
  }

  // VER TICKETS ACTIVOS
  @Get('activos')
  @Roles('SUPER_ADMIN', 'OPERADOR')
  findActivos() {
    return this.ticketsService.findActivos();
  }

  // VER UN TICKET ESPECÍFICO
  @Get(':id')
  @Roles('SUPER_ADMIN', 'OPERADOR', 'CLIENTE') // El cliente necesita consultar su propia reserva
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  // CERRAR TICKET / COBRAR
  @Patch(':id')
  @Roles('SUPER_ADMIN', 'OPERADOR')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto, @Req() request: Request) {
    const authHeader = request.headers.authorization; // Atrapamos el token
    return this.ticketsService.cerrarTicket(id, updateTicketDto, authHeader);
  }

  // ELIMINAR TICKET
  @Delete(':id')
  @Roles('SUPER_ADMIN') // Solo el administrador superior puede borrar
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}