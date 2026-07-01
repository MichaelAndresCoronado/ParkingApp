import 'dotenv/config'; // <-- Importante para que lea el .env al validar el DTO
import { IsInt, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength, Min, Max, IsEnum, ValidateNested, IsIn,} from "class-validator";
import { TipoMotocicleta } from "../entities/motocicleta.entity";
import { Type } from "class-transformer";
import { Clasificacion } from "../entities/vehiculo.entity";


// Capturamos la variable de entorno (con un fallback de seguridad por si falla)
const anioActual = parseInt(process.env.ANIO_ACTUAL ?? '2026', 10);
const anioMaximoPermitido = anioActual + 1;

class BaseVehiculoDto {
    @IsString()     //solo me va tomar estos valores.
    @Matches(/^[A-Z]{3}-\d{4}$/, { 
        message: 'La placa debe tener el formato ABC-1234' })
    placa!: string;

    @IsString()
    @IsNotEmpty({ message: 'La marca no puede estar vacía' })
    @MinLength(3, { message: 'La marca debe tener al menos 3 caracteres' })
    @MaxLength(15, { message: 'La marca no puede tener más de 15 caracteres' })
    @Matches(/^[A-Za-z\s]+$/, { message: 'La marca solo puede contener letras y espacios' })
    marca!: string;

    @IsString()
    @IsNotEmpty({ message: 'El modelo no puede estar vacío' })
    @MinLength(3, { message: 'El modelo debe tener al menos 3 caracteres' })
    @MaxLength(20, { message: 'El modelo no puede tener más de 20 caracteres' })
    @Matches(/^[A-Za-z\s]+$/, { message: 'El modelo solo puede contener letras y espacios' })
    modelo!: string

    @IsString()
    @IsNotEmpty({ message: 'El color no puede estar vacío' })
    @MinLength(4, { message: 'El color debe tener al menos 4 caracteres' })
    @MaxLength(20, { message: 'El color no puede tener más de 20 caracteres' })
    @Matches(/^[A-Za-z\s]+$/, { message: 'El color solo puede contener letras y espacios' })
    color!: string;
    
    @IsNumber()
    @IsInt({ message: 'El año debe ser un número entero' })
    @Min(1900, { message: 'El año debe ser mayor o igual a 1900' })
    @Max(anioMaximoPermitido, { 
        message: `El año de un vehículo no puede ser mayor a ${anioMaximoPermitido}` 
    })
    anio!: number; // Validacion centralizada aquí

    @IsEnum(Clasificacion, { message: 'Clasificación no válida' })
    clasificacion!: Clasificacion; // Asegúrate de que esta línea esté aquí
}


class AutoDto extends BaseVehiculoDto {
    // // --- AGREGA ESTO PARA CUMPLIR EL REQUERIMIENTO ---
    // @IsNumber()
    // @IsInt({ message: 'El año debe ser un número entero' })
    // @Min(1900, { message: 'El año debe ser mayor o igual a 1900' })
    // @Max(anioMaximoPermitido, { 
    //     message: `El año de un auto no puede ser mayor a ${anioMaximoPermitido}` 
    // })
    // declare anio: number; 
    // // -------------------------------------------------

    @IsNumber()
    @Min(2, { message: 'El número de puertas debe ser al menos 2' })
    @Max(5, { message: 'El número de puertas no puede ser mayor a 5' })
    @IsInt({ message: 'El número de puertas debe ser un número entero' })
    numeroPuertas!: number;

    @IsNumber()
    @Min(100, { message: 'La capacidad del maletero debe ser al menos 100 litros' })
    @Max(1000, { message: 'La capacidad del maletero no puede ser mayor a 1000 litros' })
    capacidadMaletero!: number;
}


class MotoDto extends BaseVehiculoDto {
    @IsString()
    @Matches(/^[A-Z]{2}-\d{3}^[A-Z]{1}$/, { 
        message: 'La placa debe tener el formato AB-123C' })
    
    declare placa: string;

    @IsNotEmpty({ message: 'El tipo de motocicleta no puede estar vacío' })
    @IsEnum(TipoMotocicleta, { message: `El tipo de motocicleta debe ser uno de los siguientes: ${Object.values(TipoMotocicleta).join(", ")}` })
    tipoMoto!: TipoMotocicleta;
}

class CamionetaDto extends BaseVehiculoDto {
    @IsString()
    @IsNotEmpty({ message: 'La cabina no puede estar vacía' })
    @MinLength(5, { message: 'La cabina debe tener al menos 5 caracteres' })
    @MaxLength(15, { message: 'La cabina no puede tener más de 15 caracteres' })
    @Matches(/^[A-Za-z\s]+$/, { message: 'La cabina solo puede contener letras y espacios' })
    cabina!: string;

    @IsNumber()
    @Min(0.5, { message: 'La capacidad de carga debe ser al menos 0.5 toneladas' })
    @Max(10, { message: 'La capacidad de carga no puede ser mayor a 10 toneladas' })
    capacidadCarga!: number;

}


export class CreateVehiculoDto {
  @IsIn(['Auto', 'Motocicleta', 'Camioneta'])
  tipo!: string;

  @ValidateNested()
  @Type((opts) => {
    const object = opts?.object as CreateVehiculoDto;
    if (!object) return BaseVehiculoDto;

    switch (object.tipo) {
      case 'Auto':
        return AutoDto;
      case 'Motocicleta':
        return MotoDto;
      case 'Camioneta':
        return CamionetaDto;
      default:
        return BaseVehiculoDto;
    }
  })
  datos!: AutoDto | MotoDto | CamionetaDto;
}
