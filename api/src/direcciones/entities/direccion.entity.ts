import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('direcciones')
export class Direccion {
  @PrimaryGeneratedColumn({ name: 'id_direccion' })
  id_direccion: number;

  @ManyToOne(() => Cliente, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cliente_fk' })
  cliente: Cliente;

  @Column({ type: 'varchar', length: 255 })
  calle: string;

  @Column({ type: 'varchar', length: 100 })
  ciudad: string;

  @Column({ type: 'varchar', length: 10, name: 'codigo_postal' })
  codigo_postal: string;

  @Column({ type: 'varchar', length: 50 })
  pais: string;

  @Column({ type: 'boolean', default: false, name: 'es_predeterminada' })
  es_predeterminada: boolean;
}
