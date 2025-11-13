import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetallesOrdenDto } from './dto/create-detalles-orden.dto';
import { UpdateDetallesOrdenDto } from './dto/update-detalles-orden.dto';
import { DetallesOrden } from './entities/detalles-orden.entity';

@Injectable()
export class DetallesOrdenService {
  constructor(
    @InjectRepository(DetallesOrden)
    private readonly detalleRepository: Repository<DetallesOrden>,
  ) {}

  create(createDetalleDto: CreateDetallesOrdenDto): Promise<DetallesOrden> {
    const { id_orden_fk, id_variante_fk, ...rest } = createDetalleDto;
    const newDetalle = this.detalleRepository.create({
      ...rest,
      orden: { id_orden: id_orden_fk },
      variante: { id_variante: id_variante_fk },
    });
    return this.detalleRepository.save(newDetalle);
  }

  findAll() {
    return this.detalleRepository.find({ relations: ['orden', 'variante'] });
  }

  findOne(id: number) {
    return this.detalleRepository.findOne({
      where: { id_detalle_orden: id },
      relations: ['orden', 'variante'],
    });
  }

  async update(
    id: number,
    updateDetalleDto: UpdateDetallesOrdenDto,
  ): Promise<DetallesOrden> {
    const { id_orden_fk, id_variante_fk, ...rest } = updateDetalleDto;

    const detalle = await this.detalleRepository.preload({
      id_detalle_orden: id,
      ...rest,
      ...(id_orden_fk && { orden: { id_orden: id_orden_fk } }),
      ...(id_variante_fk && { variante: { id_variante: id_variante_fk } }),
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle de orden con ID ${id} no encontrado`);
    }

    return this.detalleRepository.save(detalle);
  }

  remove(id: number) {
    return this.detalleRepository.delete(id);
  }
}
