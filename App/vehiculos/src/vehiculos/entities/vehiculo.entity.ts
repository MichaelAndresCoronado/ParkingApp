import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, AfterLoad} from "typeorm";

export enum Clasificacion {
    ELECTRICO = 'Eléctrico',
    HIBRIDO = 'Híbrido',
    GASOLINA = 'Gasolina',
    DIESEL = 'Diésel',
}

@Entity('vehiculo')
@TableInheritance({column: {type: 'varchar', name: 'tipo'} })
export abstract class Vehiculo {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    placa!: string;

    @Column()
    marca!: string;

    @Column()
    modelo!: string;

    @Column()
    color!: string;

    @Column()
    anio!: number;

    @Column()
    clasificacion!: Clasificacion;

    tipo!: string;

    // ESTO ES LO QUE HACE LA MAGIA
    @AfterLoad()
    setTipo() {
        this.tipo = this.obtenerTipo();
    }

    //CREAMOS UN VEHICULO
    abstract obtenerTipo(): string;

    //establcer ya vehiculos concretos

}
