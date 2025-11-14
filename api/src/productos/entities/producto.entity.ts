import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Marca } from '../../marcas/entities/marca.entity';
import { VariantesProducto } from '../../variantes-producto/entities/variantes-producto.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'id_producto' })
  id_producto: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_base' })
  precio_base: number;

  @ManyToOne(() => Categoria, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_categoria_fk' })
  categoria: Categoria;

  @ManyToOne(() => Marca, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_marca_fk' })
  marca: Marca;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_creacion' })
  fecha_creacion: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'imagen_principal_url',
  })
  imagen_principal_url: string;

  @OneToMany(() => VariantesProducto, (variante) => variante.producto, {
    cascade: true,
  })
  variantes: VariantesProducto[];
}
