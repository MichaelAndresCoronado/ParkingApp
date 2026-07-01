import 'dotenv/config';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import {
  IsString, IsNumber, IsInt, Matches,
  MinLength, MaxLength, Min, Max, IsEnum, IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoMotocicleta } from '../entities/motocicleta.entity';
import { Clasificacion } from '../entities/vehiculo.entity';

const anioActual = parseInt(process.env.ANIO_ACTUAL ?? '2026', 10);
const anioMaximoPermitido = anioActual + 1;

class BaseUpdateDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}-\d{4}$/, { message: 'La placa debe tener el formato ABC-1234' })
  placa?: string;

  @IsOptional()
  @IsString() @IsNotEmpty()
  @MinLength(3) @MaxLength(15)
  @Matches(/^[A-Za-z\s]+$/, { message: 'La marca solo puede contener letras y espacios' })
  marca?: string;

  @IsOptional()
  @IsString() @IsNotEmpty()
  @MinLength(3) @MaxLength(20)
  @Matches(/^[A-Za-z\s]+$/, { message: 'El modelo solo puede contener letras y espacios' })
  modelo?: string;

  @IsOptional()
  @IsString() @IsNotEmpty()
  @MinLength(4) @MaxLength(20)
  @Matches(/^[A-Za-z\s]+$/, { message: 'El color solo puede contener letras y espacios' })
  color?: string;

  @IsOptional()
  @IsNumber() @IsInt()
  @Min(1900) @Max(anioMaximoPermitido)
  anio?: number;

  @IsOptional()
  @IsEnum(Clasificacion, { message: 'Clasificación no válida' })
  clasificacion?: Clasificacion;
}

class AutoUpdateDto extends BaseUpdateDto {
  @IsOptional()
  @IsNumber() @IsInt()
  @Min(2) @Max(5)
  numeroPuertas?: number;

  @IsOptional()
  @IsNumber()
  @Min(100) @Max(1000)
  capacidadMaletero?: number;
}

class MotoUpdateDto extends BaseUpdateDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2}-\d{3}[A-Z]{1}$/, { message: 'La placa debe tener el formato AB-123C' })
  declare placa?: string;

  @IsOptional()
  @IsEnum(TipoMotocicleta, {
    message: `El tipo debe ser: ${Object.values(TipoMotocicleta).join(', ')}`,
  })
  tipoMoto?: TipoMotocicleta;
}

class CamionetaUpdateDto extends BaseUpdateDto {
  @IsOptional()
  @IsString() @IsNotEmpty()
  @MinLength(5) @MaxLength(15)
  @Matches(/^[A-Za-z\s]+$/, { message: 'La cabina solo puede contener letras y espacios' })
  cabina?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.5) @Max(10)
  capacidadCarga?: number;
}

export class UpdateVehiculoDto {
  @IsOptional()
  @IsIn(['Auto', 'Motocicleta', 'Camioneta'])
  tipo?: string;

  @IsOptional()
  @ValidateNested()
  @Type((opts) => {
    const obj = opts?.object as UpdateVehiculoDto;
    switch (obj?.tipo) {
      case 'Auto':        return AutoUpdateDto;
      case 'Motocicleta': return MotoUpdateDto;
      case 'Camioneta':   return CamionetaUpdateDto;
      default:            return BaseUpdateDto;
    }
  })
  datos?: AutoUpdateDto | MotoUpdateDto | CamionetaUpdateDto;
}