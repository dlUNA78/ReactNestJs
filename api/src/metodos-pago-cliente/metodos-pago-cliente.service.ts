import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetodoPagoClienteDto } from './dto/create-metodos-pago-cliente.dto';
import { UpdateMetodoPagoClienteDto } from './dto/update-metodos-pago-cliente.dto';
import { MetodosPagoCliente } from './entities/metodos-pago-cliente.entity';

@Injectable()
export class MetodosPagoClienteService {
  constructor(
    @InjectRepository(MetodosPagoCliente)
    private readonly metodosPagoRepository: Repository<MetodosPagoCliente>,
  ) {}

  create(
    createMetodoDto: CreateMetodoPagoClienteDto,
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
    updateMetodoDto: UpdateMetodoPagoClienteDto,
  ): Promise<MetodosPagoCliente> {
    const { id_cliente_fk, ...rest } = updateMetodoDto;
    const metodoToUpdate = { ...rest };

    if (id_cliente_fk) {
      metodoToUpdate['cliente'] = { id_cliente: id_cliente_fk };
    }

    await this.metodosPagoRepository.update(id, metodoToUpdate);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.metodosPagoRepository.delete(id);
  }
}
