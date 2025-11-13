import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const { password_hash, ...rest } = createClienteDto;
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const newCliente = this.clienteRepository.create({
      ...rest,
      password_hash: hashedPassword,
    });

    return this.clienteRepository.save(newCliente);
  }

  findAll() {
    return this.clienteRepository.find();
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ id_cliente: id });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    if (updateClienteDto.password_hash) {
      updateClienteDto.password_hash = await bcrypt.hash(
        updateClienteDto.password_hash,
        10,
      );
    }

    const cliente = await this.clienteRepository.preload({
      id_cliente: id,
      ...updateClienteDto,
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return this.clienteRepository.save(cliente);
  }

  async remove(id: number): Promise<void> {
    const result = await this.clienteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
  }
}
