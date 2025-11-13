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

  async create(createCarritoItemDto: CreateCarritoItemDto): Promise<CarritoItem> {
    const { id_cliente_fk, id_variante_fk, cantidad } = createCarritoItemDto;

    const existingItem = await this.carritoItemRepository.findOne({
      where: {
        cliente: { id_cliente: id_cliente_fk },
        variante: { id_variante: id_variante_fk },
      },
    });

    if (existingItem) {
      existingItem.cantidad += cantidad;
      return this.carritoItemRepository.save(existingItem);
    } else {
      const newItem = this.carritoItemRepository.create({
        cantidad,
        cliente: { id_cliente: id_cliente_fk },
        variante: { id_variante: id_variante_fk },
      });
      return this.carritoItemRepository.save(newItem);
    }
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

  async findOne(id: number): Promise<CarritoItem> {
    const item = await this.carritoItemRepository.findOne({
      where: { id_carrito_item: id },
      relations: ['cliente', 'variante'],
    });
    if (!item) {
      throw new NotFoundException(`Item de carrito con ID ${id} no encontrado`);
    }
    return item;
  }

  async update(
    id: number,
    updateCarritoItemDto: UpdateCarritoItemDto,
  ): Promise<CarritoItem> {
    const item = await this.carritoItemRepository.preload({
      id_carrito_item: id,
      ...updateCarritoItemDto,
    });

    if (!item) {
      throw new NotFoundException(`Item de carrito con ID ${id} no encontrado`);
    }

    return this.carritoItemRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.carritoItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Item de carrito con ID ${id} no encontrado`);
    }
  }
}
