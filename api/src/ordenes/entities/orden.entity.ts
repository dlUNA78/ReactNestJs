import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Direccion } from '../../direcciones/entities/direccion.entity';

@Entity('ordenes')
export class Orden {
  @PrimaryGeneratedColumn({ name: 'id_orden' })
  id_orden: number;

  @ManyToOne(() => Cliente, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_cliente_fk' })
  cliente: Cliente;

  @ManyToOne(() => Direccion, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_direccion_envio_fk' })
  direccion_envio: Direccion;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_orden' })
  fecha_orden: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 50, default: 'Pendiente' })
  estado: string;
}
