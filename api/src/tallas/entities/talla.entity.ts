import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tallas')
export class Talla {
  @PrimaryGeneratedColumn({ name: 'id_talla' })
  id_talla: number;

  @Column({ type: 'varchar', length: 20, unique: true, name: 'nombre_talla' })
  nombre_talla: string;
}
