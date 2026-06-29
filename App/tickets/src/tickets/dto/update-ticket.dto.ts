import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsNumber, IsOptional, IsBoolean } from 'class-validator'; // <-- Agrega IsBoolean aquí

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    // CORRECCIÓN: Añadir decoradores para que pase la validación estricta
    @IsBoolean()
    @IsOptional()
    activo?: boolean;

    @IsNumber()
    @IsOptional()
    valorRecaudado?: number;

}
