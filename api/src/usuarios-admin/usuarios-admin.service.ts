import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUsuariosAdminDto } from './dto/create-usuarios-admin.dto';
import { UpdateUsuariosAdminDto } from './dto/update-usuarios-admin.dto';
import { UsuariosAdmin } from './entities/usuarios-admin.entity';

@Injectable()
export class UsuariosAdminService {
  constructor(
    @InjectRepository(UsuariosAdmin)
    private readonly usuariosAdminRepository: Repository<UsuariosAdmin>,
  ) {}

  async create(
    createUsuariosAdminDto: CreateUsuariosAdminDto,
  ): Promise<UsuariosAdmin> {
    const { password_hash, id_rol_fk, ...rest } = createUsuariosAdminDto;
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const newAdmin = this.usuariosAdminRepository.create({
      ...rest,
      password_hash: hashedPassword,
      rol: { id_rol: id_rol_fk },
    });

    return this.usuariosAdminRepository.save(newAdmin);
  }

  findAll() {
    return this.usuariosAdminRepository.find({ relations: ['rol'] });
  }

  findOne(id: number) {
    return this.usuariosAdminRepository.findOne({
      where: { id_usuario: id },
      relations: ['rol'],
    });
  }

  async update(
    id: number,
    updateUsuariosAdminDto: UpdateUsuariosAdminDto,
  ): Promise<UsuariosAdmin> {
    const { password_hash, id_rol_fk, ...rest } = updateUsuariosAdminDto;

    const adminToUpdate = { ...rest };

    if (password_hash) {
      adminToUpdate['password_hash'] = await bcrypt.hash(password_hash, 10);
    }
    if (id_rol_fk) {
      adminToUpdate['rol'] = { id_rol: id_rol_fk };
    }

    await this.usuariosAdminRepository.update(id, adminToUpdate);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.usuariosAdminRepository.delete(id);
  }

  // Method for auth service
  findOneByUsername(username: string): Promise<UsuariosAdmin | undefined> {
    return this.usuariosAdminRepository.findOne({
      where: { username },
      relations: ['rol'],
    });
  }
}
