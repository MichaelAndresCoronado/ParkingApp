import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  placa!: string;

  @Column()
  dni!: string;

  @Column({ type: 'uuid' })
  idEspacio!: string;

  @Column()
  nombreZona!: string;

  @Column({ type: 'timestamp' })
  fechaHoraIngreso!: Date;

  // CORRECCIÓN: Al ingresar no hay fecha de salida, por lo que debe permitir nulos
  @Column({ type: 'timestamp', nullable: true })
  fechaHoraSalida!: Date;

  @Column({ default: true })
  activo!: boolean;

  @Column({ type: 'integer', default: 0 })
  valorRecaudado!: number;
}