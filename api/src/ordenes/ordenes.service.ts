import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return this.ordenRepository.findOne({
      where: { id_orden: id },
      relations: ['cliente', 'direccion_envio'],
    });
  }

  async update(id: number, updateOrdenDto: UpdateOrdenDto): Promise<Orden> {
    const { id_cliente_fk, id_direccion_envio_fk, ...rest } = updateOrdenDto;
    const ordenToUpdate = { ...rest };

    if (id_cliente_fk) {
      ordenToUpdate['cliente'] = { id_cliente: id_cliente_fk };
    }
    if (id_direccion_envio_fk) {
      ordenToUpdate['direccion_envio'] = {
        id_direccion: id_direccion_envio_fk,
      };
    }

    await this.ordenRepository.update(id, ordenToUpdate);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.ordenRepository.delete(id);
  }
}
