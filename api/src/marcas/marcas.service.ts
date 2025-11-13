import { Injectable } from '@nestjs/common';
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

  findOne(id: number): Promise<Marca> {
    return this.marcaRepository.findOneBy({ id_marca: id });
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    await this.marcaRepository.update(id, updateMarcaDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.marcaRepository.delete(id);
  }
}
