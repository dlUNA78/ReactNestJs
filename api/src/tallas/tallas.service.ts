import { Injectable } from '@nestjs/common';
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

  findOne(id: number): Promise<Talla> {
    return this.tallaRepository.findOneBy({ id_talla: id });
  }

  async update(id: number, updateTallaDto: UpdateTallaDto): Promise<Talla> {
    await this.tallaRepository.update(id, updateTallaDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.tallaRepository.delete(id);
  }
}
