import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { FactoryVehiculos } from './factory/factory-vehiculos';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private repositoryVehiculo: Repository<Vehiculo>,
  ) { }

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const existe = await this.repositoryVehiculo.findOne({ where: { placa: createVehiculoDto.datos.placa } });
    if (existe) {
      // Usamos BadRequestException para que tu Filtro Global devuelva un status 400
      throw new BadRequestException('La placa ya existe en el sistema');
    }

    const vehiculo = FactoryVehiculos.crear(createVehiculoDto);

    // Asignamos manualmente el tipo antes de guardar
    vehiculo.tipo = vehiculo.obtenerTipo();

    return this.repositoryVehiculo.save(vehiculo);
  }

  async findAll(): Promise<Vehiculo[]> {
    return this.repositoryVehiculo.find();
  }

  async findOne(id: string): Promise<Vehiculo> {
    const vehiculo = await this.repositoryVehiculo.findOne({ where: { id } });
    if (!vehiculo) {
      // Usamos NotFoundException para que devuelva un status 404
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }
    return vehiculo;
  }

  async findByPlaca(placa: string): Promise<Vehiculo> {
    const vehiculo = await this.repositoryVehiculo.findOne({ where: { placa } });
    if (!vehiculo) {
      // Devolvemos null en lugar de lanzar error para que Tickets pueda manejar el BadRequest
      return null as any;
    }
    return vehiculo;
  }

  // --- MÉTODOS COMPLETADOS ---

  async update(id: string, updateVehiculoDto: UpdateVehiculoDto): Promise<Vehiculo> {
    // 1. Reusamos findOne() para verificar que exista. Si no existe, lanzará el 404 automáticamente.
    const vehiculo = await this.findOne(id);

    // 2. Combinamos los datos actuales de la BD con los que vienen en el DTO
    Object.assign(vehiculo, updateVehiculoDto);

    // 3. Guardamos y retornamos el vehículo actualizado
    return this.repositoryVehiculo.save(vehiculo);
  }

  async remove(id: string): Promise<{ mensaje: string }> {
    // 1. Verificamos que el vehículo exista antes de intentar borrarlo
    const vehiculo = await this.findOne(id);

    // 2. Lo eliminamos físicamente de la base de datos
    await this.repositoryVehiculo.remove(vehiculo);

    // 3. Devolvemos la confirmación
    return { mensaje: `El vehículo con ID ${id} fue eliminado correctamente del parqueadero.` };
  }
}