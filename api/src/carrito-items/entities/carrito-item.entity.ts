import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { VariantesProducto } from '../../variantes-producto/entities/variantes-producto.entity';

@Entity('carrito_items')
export class CarritoItem {
  @PrimaryGeneratedColumn({ name: 'id_carrito_item' })
  id_carrito_item: number;

  @ManyToOne(() => Cliente, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cliente_fk' })
  cliente: Cliente;

  @ManyToOne(() => VariantesProducto, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_variante_fk' })
  variante: VariantesProducto;

  @Column({ type: 'integer', default: 1 })
  cantidad: number;
}
