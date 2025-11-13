import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
  ) {}

  create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const { id_categoria_fk, id_marca_fk, ...rest } = createProductoDto;
    const newProducto = this.productosRepository.create({
      ...rest,
      categoria: { id_categoria: id_categoria_fk },
      marca: { id_marca: id_marca_fk },
    });
    return this.productosRepository.save(newProducto);
  }

  findAll() {
    return this.productosRepository.find({ relations: ['categoria', 'marca'] });
  }

  findOne(id: number) {
    return this.productosRepository.findOne({
      where: { id_producto: id },
      relations: ['categoria', 'marca'],
    });
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    const { id_categoria_fk, id_marca_fk, ...rest } = updateProductoDto;

    const producto = await this.productosRepository.preload({
      id_producto: id,
      ...rest,
      ...(id_categoria_fk && { categoria: { id_categoria: id_categoria_fk } }),
      ...(id_marca_fk && { marca: { id_marca: id_marca_fk } }),
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return this.productosRepository.save(producto);
  }

  async remove(id: number) {
    try {
      const result = await this.productosRepository.delete(id);
      return result;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23503'
      ) {
        throw new ConflictException(
          'No se puede eliminar: Este producto es parte de una orden vendida.',
        );
      }
      throw error;
    }
  }
}
