import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarritoItemDto } from './dto/create-carrito-item.dto';
import { UpdateCarritoItemDto } from './dto/update-carrito-item.dto';
import { CarritoItem } from './entities/carrito-item.entity';

@Injectable()
export class CarritoItemsService {
  constructor(
    @InjectRepository(CarritoItem)
    private readonly carritoItemRepository: Repository<CarritoItem>,
  ) {}

  create(createCarritoItemDto: CreateCarritoItemDto): Promise<CarritoItem> {
    const { id_cliente_fk, id_variante_fk, ...rest } = createCarritoItemDto;
    const newItem = this.carritoItemRepository.create({
      ...rest,
      cliente: { id_cliente: id_cliente_fk },
      variante: { id_variante: id_variante_fk },
    });
    return this.carritoItemRepository.save(newItem);
  }

  findAll() {
    return this.carritoItemRepository.find({
      relations: [
        'cliente',
        'variante',
        'variante.producto', // <-- Añade esta línea
        'variante.talla', // <-- Y esta (la necesitarás también)
      ],
    });
  }

  findOne(id: number) {
    return this.carritoItemRepository.findOne({
      where: { id_carrito_item: id },
      relations: ['cliente', 'variante'],
    });
  }

  async update(
    id: number,
    updateCarritoItemDto: UpdateCarritoItemDto,
  ): Promise<CarritoItem> {
    const { id_cliente_fk, id_variante_fk, ...rest } = updateCarritoItemDto;

    const item = await this.carritoItemRepository.preload({
      id_carrito_item: id,
      ...rest,
      ...(id_cliente_fk && { cliente: { id_cliente: id_cliente_fk } }),
      ...(id_variante_fk && { variante: { id_variante: id_variante_fk } }),
    });

    if (!item) {
      throw new NotFoundException(`Item de carrito con ID ${id} no encontrado`);
    }

    return this.carritoItemRepository.save(item);
  }

  remove(id: number) {
    return this.carritoItemRepository.delete(id);
  }
}
