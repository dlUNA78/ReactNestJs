import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { Marca } from './entities/marca.entity';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
  ) {}

  create(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    const marca = this.marcaRepository.create(createMarcaDto);
    return this.marcaRepository.save(marca);
  }

  findAll(): Promise<Marca[]> {
    return this.marcaRepository.find();
  }

  async findOne(id: number): Promise<Marca> {
    const marca = await this.marcaRepository.findOneBy({ id_marca: id });
    if (!marca) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }
    return marca;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    const marca = await this.marcaRepository.preload({
      id_marca: id,
      ...updateMarcaDto,
    });

    if (!marca) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    return this.marcaRepository.save(marca);
  }

  async remove(id: number): Promise<void> {
    const result = await this.marcaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }
  }
}
