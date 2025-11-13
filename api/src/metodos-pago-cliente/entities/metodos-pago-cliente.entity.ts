import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('metodos_pago_cliente')
export class MetodosPagoCliente {
  @PrimaryGeneratedColumn({ name: 'id_metodo_pago' })
  id_metodo_pago: number;

  @ManyToOne(() => Cliente, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cliente_fk' })
  cliente: Cliente;

  @Column({ type: 'varchar', length: 255, name: 'token_pasarela' })
  token_pasarela: string;
}
