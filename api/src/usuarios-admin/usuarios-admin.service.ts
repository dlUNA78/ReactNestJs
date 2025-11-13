import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number): Promise<UsuariosAdmin> {
    const admin = await this.usuariosAdminRepository.findOne({
      where: { id_usuario: id },
      relations: ['rol'],
    });
    if (!admin) {
      throw new NotFoundException(`Usuario admin con ID ${id} no encontrado`);
    }
    return admin;
  }

  async update(
    id: number,
    updateUsuariosAdminDto: UpdateUsuariosAdminDto,
  ): Promise<UsuariosAdmin> {
    const { id_rol_fk, ...rest } = updateUsuariosAdminDto;

    if (rest.password_hash) {
      rest.password_hash = await bcrypt.hash(rest.password_hash, 10);
    }

    const admin = await this.usuariosAdminRepository.preload({
      id_usuario: id,
      ...rest,
      ...(id_rol_fk && { rol: { id_rol: id_rol_fk } }),
    });

    if (!admin) {
      throw new NotFoundException(`Usuario admin con ID ${id} no encontrado`);
    }

    return this.usuariosAdminRepository.save(admin);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuariosAdminRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario admin con ID ${id} no encontrado`);
    }
  }

  // Method for auth service
  findOneByUsername(username: string): Promise<UsuariosAdmin | null> {
    return this.usuariosAdminRepository.findOne({
      where: { username },
      relations: ['rol'],
    });
  }
}
