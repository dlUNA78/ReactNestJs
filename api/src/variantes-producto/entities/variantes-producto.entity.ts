import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Talla } from '../../tallas/entities/talla.entity';
import { DetallesOrden } from '../../detalles-orden/entities/detalles-orden.entity';
import { CarritoItem } from '../../carrito-items/entities/carrito-item.entity';

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

  @OneToMany(() => DetallesOrden, (detalle) => detalle.variante, {
    cascade: true,
  })
  detalles_orden: DetallesOrden[];

  @OneToMany(() => CarritoItem, (item) => item.variante, { cascade: true })
  carrito_items: CarritoItem[];
}
