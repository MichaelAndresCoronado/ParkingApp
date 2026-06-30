
import { ChildEntity, Column } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';

export enum TipoMotocicleta {
    DEPORTIVA = 'Deportiva',
}

@ChildEntity('Motocicleta')
export class Motocicleta extends Vehiculo {
    @Column()
    tipoMoto!: TipoMotocicleta;

    obtenerTipo(): string {
        return 'Motocicleta';
    }

}