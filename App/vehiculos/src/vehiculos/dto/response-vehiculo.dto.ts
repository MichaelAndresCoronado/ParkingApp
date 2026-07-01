import { Clasificacion } from '../entities/vehiculo.entity';
import { TipoMotocicleta } from '../entities/motocicleta.entity';

export class ResponseVehiculoDto {
    id!: string;
    placa!: string
    marca!: string;
    modelo!: string
    anio!: number;
    color!: string;
    clasificacion!: Clasificacion;
    numeroPuertas?: number;
    capacidadMaletero?: number;
    cabina?: string;
    capacidadCarga?: number;
    tipoMoto!: TipoMotocicleta;
}