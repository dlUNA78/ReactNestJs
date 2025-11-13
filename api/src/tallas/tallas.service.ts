import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTallaDto } from './dto/create-talla.dto';
import { UpdateTallaDto } from './dto/update-talla.dto';
import { Talla } from './entities/talla.entity';

@Injectable()
export class TallasService {
  constructor(
    @InjectRepository(Talla)
    private readonly tallaRepository: Repository<Talla>,
  ) {}

  create(createTallaDto: CreateTallaDto): Promise<Talla> {
    const talla = this.tallaRepository.create(createTallaDto);
    return this.tallaRepository.save(talla);
  }

  findAll(): Promise<Talla[]> {
    return this.tallaRepository.find();
  }

  async findOne(id: number): Promise<Talla> {
    const talla = await this.tallaRepository.findOneBy({ id_talla: id });
    if (!talla) {
      throw new NotFoundException(`Talla con ID ${id} no encontrada`);
    }
    return talla;
  }

  async update(id: number, updateTallaDto: UpdateTallaDto): Promise<Talla> {
    const talla = await this.tallaRepository.preload({
      id_talla: id,
      ...updateTallaDto,
    });

    if (!talla) {
      throw new NotFoundException(`Talla con ID ${id} no encontrada`);
    }

    return this.tallaRepository.save(talla);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tallaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Talla con ID ${id} no encontrada`);
    }
  }
}
