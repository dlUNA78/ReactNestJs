import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Talla } from '../../tallas/entities/talla.entity';

@Entity('variantes_producto')
export class VariantesProducto {
  @PrimaryGeneratedColumn({ name: 'id_variante' })
  id_variante: number;

  @ManyToOne(() => Producto, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_producto_fk' })
  producto: Producto;

  @ManyToOne(() => Talla, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_talla_fk' })
  talla: Talla;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'integer', name: 'stock_disponible', default: 0 })
  stock_disponible: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'imagen_url' })
  imagen_url: string;
}
