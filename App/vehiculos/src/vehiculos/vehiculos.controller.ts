import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

// Importaciones de seguridad
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { RolesGuard } from '../security/roles.guard';
import { Roles } from '../security/roles.decorator';

@Controller('vehiculos')
@UseGuards(JwtAuthGuard, RolesGuard) // <-- Candado maestro: Todos necesitan token y pasan por la revisión de roles
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  // REGISTRAR: Todos pueden registrar un vehículo nuevo
  @Post()
  @Roles('SUPER_ADMIN', 'OPERADOR', 'CLIENTE') 
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.create(createVehiculoDto);
  }

  // LISTAR TODO: Un cliente no necesita ver los carros de los demás
  @Get()
  @Roles('SUPER_ADMIN', 'OPERADOR') 
  findAll() {
    return this.vehiculosService.findAll();
  }

  // BUSCAR POR PLACA: Necesario para que el operador emita tickets
  @Get('placa/:placa')
  @Roles('SUPER_ADMIN', 'OPERADOR', 'CLIENTE')
  findByPlaca(@Param('placa') placa: string) {
    return this.vehiculosService.findByPlaca(placa);
  }

  // BUSCAR POR ID
  @Get(':id')
  @Roles('SUPER_ADMIN', 'OPERADOR', 'CLIENTE')
  findOne(@Param('id') id: string) {
    return this.vehiculosService.findOne(id);
  }

  // ACTUALIZAR: Modificar datos físicos del vehículo
  @Patch(':id')
  @Roles('SUPER_ADMIN', 'OPERADOR')
  update(@Param('id') id: string, @Body() updateVehiculoDto: UpdateVehiculoDto) {
    return this.vehiculosService.update(id, updateVehiculoDto);
  }

  // ELIMINAR: Control total exclusivo del administrador
  @Delete(':id')
  @Roles('SUPER_ADMIN') 
  remove(@Param('id') id: string) {
    return this.vehiculosService.remove(id);
  }
}