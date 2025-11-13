import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return this.variantesRepository.findOne({
      where: { id_variante: id },
      relations: ['producto', 'talla'],
    });
  }

  async update(
    id: number,
    updateVarianteDto: UpdateVariantesProductoDto,
  ): Promise<VariantesProducto> {
    const { id_producto_fk, id_talla_fk, ...rest } = updateVarianteDto;
    const varianteToUpdate = { ...rest };

    if (id_producto_fk) {
      varianteToUpdate['producto'] = { id_producto: id_producto_fk };
    }
    if (id_talla_fk) {
      varianteToUpdate['talla'] = { id_talla: id_talla_fk };
    }

    await this.variantesRepository.update(id, varianteToUpdate);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.variantesRepository.delete(id);
  }
}
