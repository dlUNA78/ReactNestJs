import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  id_rol: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'nombre_rol' })
  nombre_rol: string;
}
