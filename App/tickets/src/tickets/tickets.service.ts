// import { BadRequestException, Injectable } from '@nestjs/common';
// import { CreateTicketDto } from './dto/create-ticket.dto';
// import { UpdateTicketDto } from './dto/update-ticket.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { HttpClientService } from '../common/httpl-client.service';
// import { Ticket } from './entities/ticket.entity';
// import { Repository } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
// import { Vehiculo } from '../interfaces/vehiculo.interfaces'; 
// import { Persona } from '../interfaces/persona.interface';
// import { Espacio } from '../interfaces/espacio.interfaces';
// import { Logger } from '@nestjs/common';

// @Injectable()
// export class TicketsService {
//   private readonly logger = new Logger(TicketsService.name);
//   private readonly personaUrl: string;
//   private readonly espacioUrl: string;
//   private readonly tarifaPorHora: number;
//   private readonly vehiculoUrl: string;

//   constructor(
//     @InjectRepository(Ticket)
//     private ticketRepository: Repository<Ticket>,
//     private httpClient: HttpClientService,
//     private configService: ConfigService,
//   ) {
//     this.personaUrl = this.configService.get('PERSONA_URL')!;
//     this.espacioUrl = this.configService.get('ESPACIO_URL')!;
//     this.vehiculoUrl = this.configService.get('VEHICULO_URL')!;
//     this.tarifaPorHora = this.configService.get('TARIFA_POR_HORA',1.5)!;
//   }

//   async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
//     // 1. Validar persona
//     const persona = await this.validarPersona(createTicketDto.dni);
//     if (!persona) throw new BadRequestException(`No se encontró una persona con DNI ${createTicketDto.dni}`);

//     // 2. Validar la placa
//     const vehiculo = await this.validarPlaca(createTicketDto.placa);
//     if (!vehiculo) throw new BadRequestException(`No se encontró un vehículo con placa ${createTicketDto.placa}`);

//     // 3. Buscar espacio disponible
//     const espacio = await this.validarEspacioDisponible(createTicketDto.idEspacio, createTicketDto.zona);
//     if (!espacio) throw new BadRequestException(`No se encontró un espacio disponible con ID ${createTicketDto.idEspacio} en la zona ${createTicketDto.zona}`);

//     // 4. Validar que no exista un ticket activo para esa placa
//     await this.validarTicketActivo(createTicketDto.placa);

//     // 5. CORRECCIÓN DEFINITIVA: Asignar cada propiedad manualmente para evitar nulos
//     const ticket = this.ticketRepository.create({
//       placa: createTicketDto.placa,
//       dni: createTicketDto.dni,
//       idEspacio: createTicketDto.idEspacio,
//       nombreZona: createTicketDto.zona, // Pasamos el valor de 'zona' a 'nombreZona'
//       fechaHoraIngreso: new Date(),
//       activo: true,
//       valorRecaudado: 0,
//     });

//     const ticketGuardado = await this.ticketRepository.save(ticket);
//     //cambiar de estado al espacio a OCUPADO... agregar metodo privado que llame al endpoint en el otro microservicio 
//     this.logger.log(`Ticket creado con ID ${ticketGuardado.id} para vehículo con placa ${ticketGuardado.placa}`);

//     // --- NUEVO PASO: OCUPAR EL ESPACIO ---
//     await this.cambiarEstadoEspacio(ticketGuardado.idEspacio, 'OCUPADO');

//     return ticketGuardado;
//   }


//   async findAll():Promise<Ticket[]> {
//     return this.ticketRepository.find({ order: { fechaHoraIngreso: 'DESC' } });
//   }

//   async findOne(id: string):Promise<Ticket> {
//     const ticket = await this.ticketRepository.findOne({ where: { id } });
//     if (!ticket) throw new BadRequestException(`Ticket con id ${id} no ecnotrado`);

//     return ticket;
//   }

//   async findActivos(): Promise<Ticket[]> {
//     return this.ticketRepository.find({ 
//       where: { activo: true },
//       order: { fechaHoraIngreso: 'DESC' }
//     });
//   }



//   async cerrarTicket(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
//     // 1. Buscar si el ticket existe
//     const ticket = await this.findOne(id);
//     if (!ticket) throw new BadRequestException(`Ticket con id ${id} no encontrado`);

//     // 2. Validar que el ticket no esté cerrado ya
//     if (!ticket.activo) {
//       throw new BadRequestException(`El ticket con id ${id} ya se encuentra cerrado`);
//     }

//     // 3. Calcular tiempos y costos
//     const fechaSalida = new Date();
//     const horas = this.calcularHoras(ticket.fechaHoraIngreso, fechaSalida);
//     const costo = horas * this.tarifaPorHora;

//     // 4. Actualizar los datos del ticket local
//     ticket.activo = false;
//     ticket.fechaHoraSalida = fechaSalida;
    
//     // Si desde Postman envían un valor manual lo toma, si no, usa el costo calculado automáticamente
//     ticket.valorRecaudado = updateTicketDto.valorRecaudado || costo;

//     // 5. Guardar los cambios del ticket en la base de datos local (PostgreSQL)
//     const closedTicket = await this.ticketRepository.save(ticket);
//     this.logger.log(`Ticket con id ${id} cerrado exitosamente. Total recaudado: $${ticket.valorRecaudado}`);

//     // 6. REGLA DE NEGOCIO CRÍTICA: Liberar el espacio en el microservicio de Spring Boot
//     await this.cambiarEstadoEspacio(ticket.idEspacio, 'DISPONIBLE');

//     return closedTicket;
//   }

//   async reservarEspacio(idEspacio: string) {
//   // Aquí podríamos validar primero si está DISPONIBLE

//   // Le mandamos la orden a Spring Boot de ponerlo en RESERVADO
//   await this.cambiarEstadoEspacio(idEspacio, 'RESERVADO');

//   return { 
//     mensaje: `El espacio ha sido RESERVADO exitosamente.`,
//     expiracion: `Esta reserva se cancelará automáticamente en 5 minutos si no se emite el ticket final.`
//   };
// }


//   remove(id: string) {
//     return `This action removes a #${id} ticket`;
//   }






//   /////////////////METRODOS PRIVADOS//////////////////////////////
//   private async validarPersona(dni:string):Promise<Persona | null> {
//     try {
//       const url = `${this.personaUrl}/${dni}`; 
//       const persona = await this.httpClient.get<Persona>(url);
//       return persona;
//     } catch (error) {
//       this.logger.error(`Error al validar persona con DNI ${dni}: ${error}`);
//       return null;
//     }  
//   }

//   private async validarPlaca(placa:string):Promise<Vehiculo | null> {
//     try {
//       // CORRECCIÓN: Agregamos /placa/ a la URL
//       const url = `${this.vehiculoUrl}/placa/${placa}`; 
//       const vehiculo = await this.httpClient.get<Vehiculo>(url);
//       return vehiculo;
//     } catch (error) {
//       this.logger.error(`Error al validar placa ${placa}: ${error}`);
//       return null;
//     }
//   }

//   private async validarEspacioDisponible(idEspacio: string, idZona: string): Promise<Espacio | null> {
//     try {
//       // CORRECCIÓN: Usamos la URL exacta que tienes en tu controlador de Spring Boot (Zonas-Espacios)
//       const url = `${this.espacioUrl}/zona/${idZona}/estado/DISPONIBLE`; 
//       const espaciosDisponibles = await this.httpClient.get<Espacio[]>(url);

//       return espaciosDisponibles.find(espacio => espacio.id === idEspacio) || null;
//     } catch (error) {
//       this.logger.error(`Error al validar espacio disponible: ${error}`);
//       return null;
//     }
//   } 

//   private async validarTicketActivo(placa:string):Promise<void> {
//     const ticketActivo = await this.ticketRepository.findOne({ 
//       where: { placa, activo: true },
//    });
//     if (ticketActivo) {
//       throw new BadRequestException(
//         `Ya existe un ticket activo con esta placa`,
//       );
//     }
//   }

//   private calcularHoras(ingreso: Date, salida: Date): number {
//     const diffMs = salida.getTime() - ingreso.getTime();
//     const diffHoras = diffMs / (1000 * 60 * 60);
//     return Math.ceil(diffHoras);
//   }

//   private async cambiarEstadoEspacio(idEspacio: string, nuevoEstado: string): Promise<void> {
//     try {
//       // Apunta a: http://localhost:8081/api/espacios/{id}/estado
//       const url = `${this.espacioUrl}/${idEspacio}/estado`; 
      
//       // Enviamos el DTO que espera Spring Boot: { "nuevoEstado": "OCUPADO" }
//       await this.httpClient.patch(url, { nuevoEstado });
      
//       this.logger.log(`El espacio ${idEspacio} ahora está ${nuevoEstado}`);
//     } catch (error) {
//       this.logger.error(`Error de red al intentar cambiar el estado del espacio: ${error}`);
//       // Nota: En un sistema ultra robusto, si esto falla, deberíamos aplicar un "rollback" y borrar el ticket.
//     }
//   }
// }

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpClientService } from '../common/httpl-client.service';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Vehiculo } from '../interfaces/vehiculo.interfaces'; 
import { Persona } from '../interfaces/persona.interface';
import { Espacio } from '../interfaces/espacio.interfaces';
import { Logger } from '@nestjs/common';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  private readonly personaUrl: string;
  private readonly espacioUrl: string;
  private readonly tarifaPorHora: number;
  private readonly vehiculoUrl: string;

  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private httpClient: HttpClientService,
    private configService: ConfigService,
  ) {
    this.personaUrl = this.configService.get('PERSONA_URL')!;
    this.espacioUrl = this.configService.get('ESPACIO_URL')!;
    this.vehiculoUrl = this.configService.get('VEHICULO_URL')!;
    this.tarifaPorHora = this.configService.get('TARIFA_POR_HORA',1.5)!;
  }

  // Recibimos el authHeader desde el controlador
  async create(createTicketDto: CreateTicketDto, authHeader?: string): Promise<Ticket> {
    // 1. Validar persona
    const persona = await this.validarPersona(createTicketDto.dni, authHeader);
    if (!persona) throw new BadRequestException(`No se encontró una persona con DNI ${createTicketDto.dni}`);

    // 2. Validar la placa
    const vehiculo = await this.validarPlaca(createTicketDto.placa, authHeader);
    if (!vehiculo) throw new BadRequestException(`No se encontró un vehículo con placa ${createTicketDto.placa}`);

    // 3. Buscar espacio disponible
    const espacio = await this.validarEspacioDisponible(createTicketDto.idEspacio, createTicketDto.zona, authHeader);
    if (!espacio) throw new BadRequestException(`No se encontró un espacio disponible con ID ${createTicketDto.idEspacio} en la zona ${createTicketDto.zona}`);

    // 4. Validar que no exista un ticket activo para esa placa
    await this.validarTicketActivo(createTicketDto.placa);

    // 5. CORRECCIÓN DEFINITIVA: Asignar cada propiedad manualmente para evitar nulos
    const ticket = this.ticketRepository.create({
      placa: createTicketDto.placa,
      dni: createTicketDto.dni,
      idEspacio: createTicketDto.idEspacio,
      nombreZona: createTicketDto.zona, // Pasamos el valor de 'zona' a 'nombreZona'
      fechaHoraIngreso: new Date(),
      activo: true,
      valorRecaudado: 0,
    });

    const ticketGuardado = await this.ticketRepository.save(ticket);
    //cambiar de estado al espacio a OCUPADO... agregar metodo privado que llame al endpoint en el otro microservicio 
    this.logger.log(`Ticket creado con ID ${ticketGuardado.id} para vehículo con placa ${ticketGuardado.placa}`);

    // --- NUEVO PASO: OCUPAR EL ESPACIO ---
    await this.cambiarEstadoEspacio(ticketGuardado.idEspacio, 'OCUPADO', authHeader);

    return ticketGuardado;
  }

  async findAll():Promise<Ticket[]> {
    return this.ticketRepository.find({ order: { fechaHoraIngreso: 'DESC' } });
  }

  async findOne(id: string):Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) throw new BadRequestException(`Ticket con id ${id} no ecnotrado`);

    return ticket;
  }

  async findActivos(): Promise<Ticket[]> {
    return this.ticketRepository.find({ 
      where: { activo: true },
      order: { fechaHoraIngreso: 'DESC' }
    });
  }

  // Recibimos el authHeader desde el controlador
  async cerrarTicket(id: string, updateTicketDto: UpdateTicketDto, authHeader?: string): Promise<Ticket> {
    // 1. Buscar si el ticket existe
    const ticket = await this.findOne(id);
    if (!ticket) throw new BadRequestException(`Ticket con id ${id} no encontrado`);

    // 2. Validar que el ticket no esté cerrado ya
    if (!ticket.activo) {
      throw new BadRequestException(`El ticket con id ${id} ya se encuentra cerrado`);
    }

    // 3. Calcular tiempos y costos
    const fechaSalida = new Date();
    const horas = this.calcularHoras(ticket.fechaHoraIngreso, fechaSalida);
    const costo = horas * this.tarifaPorHora;

    // 4. Actualizar los datos del ticket local
    ticket.activo = false;
    ticket.fechaHoraSalida = fechaSalida;
    
    // Si desde Postman envían un valor manual lo toma, si no, usa el costo calculado automáticamente
    ticket.valorRecaudado = updateTicketDto.valorRecaudado || costo;

    // 5. Guardar los cambios del ticket en la base de datos local (PostgreSQL)
    const closedTicket = await this.ticketRepository.save(ticket);
    this.logger.log(`Ticket con id ${id} cerrado exitosamente. Total recaudado: $${ticket.valorRecaudado}`);

    // 6. REGLA DE NEGOCIO CRÍTICA: Liberar el espacio en el microservicio de Spring Boot
    await this.cambiarEstadoEspacio(ticket.idEspacio, 'DISPONIBLE', authHeader);

    return closedTicket;
  }

  // Recibimos el authHeader desde el controlador
  async reservarEspacio(idEspacio: string, authHeader?: string) {
    // Aquí podríamos validar primero si está DISPONIBLE

    // Le mandamos la orden a Spring Boot de ponerlo en RESERVADO
    await this.cambiarEstadoEspacio(idEspacio, 'RESERVADO', authHeader);

    return { 
      mensaje: `El espacio ha sido RESERVADO exitosamente.`,
      expiracion: `Esta reserva se cancelará automáticamente en 5 minutos si no se emite el ticket final.`
    };
  }

  remove(id: string) {
    return `This action removes a #${id} ticket`;
  }

  /////////////////METRODOS PRIVADOS//////////////////////////////
  
  private async validarPersona(dni:string, authHeader?: string):Promise<Persona | null> {
    try {
      const url = `${this.personaUrl}/${dni}`; 
      const headers = authHeader ? { Authorization: authHeader } : undefined;
      const persona = await this.httpClient.get<Persona>(url, headers);
      return persona;
    } catch (error) {
      this.logger.error(`Error al validar persona con DNI ${dni}: ${error}`);
      return null;
    }  
  }

  private async validarPlaca(placa:string, authHeader?: string):Promise<Vehiculo | null> {
    try {
      // CORRECCIÓN: Agregamos /placa/ a la URL
      const url = `${this.vehiculoUrl}/placa/${placa}`; 
      const headers = authHeader ? { Authorization: authHeader } : undefined;
      const vehiculo = await this.httpClient.get<Vehiculo>(url, headers);
      return vehiculo;
    } catch (error) {
      this.logger.error(`Error al validar placa ${placa}: ${error}`);
      return null;
    }
  }

  private async validarEspacioDisponible(idEspacio: string, idZona: string, authHeader?: string): Promise<Espacio | null> {
    try {
      // CORRECCIÓN: Usamos la URL exacta que tienes en tu controlador de Spring Boot (Zonas-Espacios)
      const url = `${this.espacioUrl}/zona/${idZona}/estado/DISPONIBLE`; 
      const headers = authHeader ? { Authorization: authHeader } : undefined;
      const espaciosDisponibles = await this.httpClient.get<Espacio[]>(url, headers);

      return espaciosDisponibles.find(espacio => espacio.id === idEspacio) || null;
    } catch (error) {
      this.logger.error(`Error al validar espacio disponible: ${error}`);
      return null;
    }
  } 

  private async validarTicketActivo(placa:string):Promise<void> {
    const ticketActivo = await this.ticketRepository.findOne({ 
      where: { placa, activo: true },
    });
    if (ticketActivo) {
      throw new BadRequestException(
        `Ya existe un ticket activo con esta placa`,
      );
    }
  }

  private calcularHoras(ingreso: Date, salida: Date): number {
    const diffMs = salida.getTime() - ingreso.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);
    return Math.ceil(diffHoras);
  }

  private async cambiarEstadoEspacio(idEspacio: string, nuevoEstado: string, authHeader?: string): Promise<void> {
    try {
      // Apunta a: http://localhost:8081/api/espacios/{id}/estado
      const url = `${this.espacioUrl}/${idEspacio}/estado`; 
      const headers = authHeader ? { Authorization: authHeader } : undefined;
      
      // Enviamos el DTO que espera Spring Boot: { "nuevoEstado": "OCUPADO" }
      await this.httpClient.patch(url, { nuevoEstado }, headers);
      
      this.logger.log(`El espacio ${idEspacio} ahora está ${nuevoEstado}`);
    } catch (error) {
      this.logger.error(`Error de red al intentar cambiar el estado del espacio: ${error}`);
      // Nota: En un sistema ultra robusto, si esto falla, deberíamos aplicar un "rollback" y borrar el ticket.
    }
  }
}