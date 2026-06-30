import { ChildEntity, Column } from "typeorm";
import { Vehiculo } from "./vehiculo.entity";


@ChildEntity('Auto')
export class Auto extends Vehiculo {

    @Column()
    numeroPuertas!: number;

    @Column()
    capacidadMaletero!: number;

    //metodo abstracto para obtener el tipo de vehiculo
    obtenerTipo(): string {
        return 'Auto';
    }

}