import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetodosPagoClienteDto } from './dto/create-metodos-pago-cliente.dto';
import { UpdateMetodosPagoClienteDto } from './dto/update-metodos-pago-cliente.dto';
import { MetodosPagoCliente } from './entities/metodos-pago-cliente.entity';

@Injectable()
export class MetodosPagoClienteService {
  constructor(
    @InjectRepository(MetodosPagoCliente)
    private readonly metodosPagoRepository: Repository<MetodosPagoCliente>,
  ) {}

  create(
    createMetodoDto: CreateMetodosPagoClienteDto,
  ): Promise<MetodosPagoCliente> {
    const { id_cliente_fk, ...rest } = createMetodoDto;
    const newMetodo = this.metodosPagoRepository.create({
      ...rest,
      cliente: { id_cliente: id_cliente_fk },
    });
    return this.metodosPagoRepository.save(newMetodo);
  }

  findAll() {
    return this.metodosPagoRepository.find({ relations: ['cliente'] });
  }

  findOne(id: number) {
    return this.metodosPagoRepository.findOne({
      where: { id_metodo_pago: id },
      relations: ['cliente'],
    });
  }

  async update(
    id: number,
    updateMetodoDto: UpdateMetodosPagoClienteDto,
  ): Promise<MetodosPagoCliente> {
    const { id_cliente_fk, ...rest } = updateMetodoDto;

    const metodo = await this.metodosPagoRepository.preload({
      id_metodo_pago: id,
      ...rest,
      ...(id_cliente_fk && { cliente: { id_cliente: id_cliente_fk } }),
    });

    if (!metodo) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado`);
    }

    return this.metodosPagoRepository.save(metodo);
  }

  remove(id: number) {
    return this.metodosPagoRepository.delete(id);
  }
}
