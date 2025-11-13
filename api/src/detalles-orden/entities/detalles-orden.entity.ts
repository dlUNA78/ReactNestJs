import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Orden } from '../../ordenes/entities/orden.entity';
import { VariantesProducto } from '../../variantes-producto/entities/variantes-producto.entity';

@Entity('detalles_orden')
export class DetallesOrden {
  @PrimaryGeneratedColumn({ name: 'id_detalle_orden' })
  id_detalle_orden: number;

  @ManyToOne(() => Orden, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_orden_fk' })
  orden: Orden;

  @ManyToOne(() => VariantesProducto, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_variante_fk' })
  variante: VariantesProducto;

  @Column({ type: 'integer' })
  cantidad: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'precio_unitario_snapshot',
  })
  precio_unitario_snapshot: number;
}
