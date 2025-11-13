import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVariantesProductoDto } from './dto/create-variantes-producto.dto';
import { UpdateVariantesProductoDto } from './dto/update-variantes-producto.dto';
import { VariantesProducto } from './entities/variantes-producto.entity';

@Injectable()
export class VariantesProductoService {
  constructor(
    @InjectRepository(VariantesProducto)
    private readonly variantesRepository: Repository<VariantesProducto>,
  ) {}

  create(
    createVarianteDto: CreateVariantesProductoDto,
  ): Promise<VariantesProducto> {
    const { id_producto_fk, id_talla_fk, ...rest } = createVarianteDto;
    const nuevaVariante = this.variantesRepository.create({
      ...rest,
      producto: { id_producto: id_producto_fk },
      talla: { id_talla: id_talla_fk },
    });
    return this.variantesRepository.save(nuevaVariante);
  }

  findAll() {
    return this.variantesRepository.find({ relations: ['producto', 'talla'] });
  }

  async findOne(id: number): Promise<VariantesProducto> {
    const variante = await this.variantesRepository.findOne({
      where: { id_variante: id },
      relations: ['producto', 'talla'],
    });
    if (!variante) {
      throw new NotFoundException(`Variante de producto con ID ${id} no encontrada`);
    }
    return variante;
  }

  async update(
    id: number,
    updateVarianteDto: UpdateVariantesProductoDto,
  ): Promise<VariantesProducto> {
    const { id_producto_fk, id_talla_fk, ...rest } = updateVarianteDto;

    const variante = await this.variantesRepository.preload({
      id_variante: id,
      ...rest,
      ...(id_producto_fk && { producto: { id_producto: id_producto_fk } }),
      ...(id_talla_fk && { talla: { id_talla: id_talla_fk } }),
    });

    if (!variante) {
      throw new NotFoundException(`Variante de producto con ID ${id} no encontrada`);
    }

    return this.variantesRepository.save(variante);
  }

  async remove(id: number): Promise<void> {
    const result = await this.variantesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Variante de producto con ID ${id} no encontrada`);
    }
  }
}
