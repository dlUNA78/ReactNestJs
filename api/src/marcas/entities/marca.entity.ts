import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('marcas')
export class Marca {
  @PrimaryGeneratedColumn({ name: 'id_marca' })
  id_marca: number;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'nombre' })
  nombre: string;
}
