import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { Orden } from './entities/orden.entity';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,
  ) {}

  create(createOrdenDto: CreateOrdenDto): Promise<Orden> {
    const { id_cliente_fk, id_direccion_envio_fk, ...rest } = createOrdenDto;
    const newOrden = this.ordenRepository.create({
      ...rest,
      cliente: { id_cliente: id_cliente_fk },
      direccion_envio: { id_direccion: id_direccion_envio_fk },
    });
    return this.ordenRepository.save(newOrden);
  }

  findAll() {
    return this.ordenRepository.find({
      relations: ['cliente', 'direccion_envio'],
    });
  }

  async findOne(id: number): Promise<Orden> {
    const orden = await this.ordenRepository.findOne({
      where: { id_orden: id },
      relations: ['cliente', 'direccion_envio'],
    });
    if (!orden) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return orden;
  }

  async update(id: number, updateOrdenDto: UpdateOrdenDto): Promise<Orden> {
    const { id_cliente_fk, id_direccion_envio_fk, ...rest } = updateOrdenDto;

    const orden = await this.ordenRepository.preload({
      id_orden: id,
      ...rest,
      ...(id_cliente_fk && { cliente: { id_cliente: id_cliente_fk } }),
      ...(id_direccion_envio_fk && {
        direccion_envio: { id_direccion: id_direccion_envio_fk },
      }),
    });

    if (!orden) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return this.ordenRepository.save(orden);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ordenRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
  }
}
