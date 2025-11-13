import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { Direccion } from './entities/direccion.entity';

@Injectable()
export class DireccionesService {
  constructor(
    @InjectRepository(Direccion)
    private readonly direccionRepository: Repository<Direccion>,
  ) {}

  create(createDireccionDto: CreateDireccionDto): Promise<Direccion> {
    const { id_cliente_fk, ...rest } = createDireccionDto;
    const newDireccion = this.direccionRepository.create({
      ...rest,
      cliente: { id_cliente: id_cliente_fk },
    });
    return this.direccionRepository.save(newDireccion);
  }

  findAll() {
    return this.direccionRepository.find({ relations: ['cliente'] });
  }

  findOne(id: number) {
    return this.direccionRepository.findOne({
      where: { id_direccion: id },
      relations: ['cliente'],
    });
  }

  async update(
    id: number,
    updateDireccionDto: UpdateDireccionDto,
  ): Promise<Direccion> {
    const { id_cliente_fk, ...rest } = updateDireccionDto;
    const direccionToUpdate = { ...rest };

    if (id_cliente_fk) {
      direccionToUpdate['cliente'] = { id_cliente: id_cliente_fk };
    }

    await this.direccionRepository.update(id, direccionToUpdate);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.direccionRepository.delete(id);
  }
}
