import { Injectable, NotFoundException } from '@nestjs/common';
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

    const direccion = await this.direccionRepository.preload({
      id_direccion: id,
      ...rest,
      ...(id_cliente_fk && { cliente: { id_cliente: id_cliente_fk } }),
    });

    if (!direccion) {
      throw new NotFoundException(`Dirección con ID ${id} no encontrada`);
    }

    return this.direccionRepository.save(direccion);
  }

  remove(id: number) {
    return this.direccionRepository.delete(id);
  }
}
