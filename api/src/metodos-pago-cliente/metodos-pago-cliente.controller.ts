import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetodosPagoClienteService } from './metodos-pago-cliente.service';
import { CreateMetodosPagoClienteDto } from './dto/create-metodos-pago-cliente.dto';
import { UpdateMetodosPagoClienteDto } from './dto/update-metodos-pago-cliente.dto';

@Controller('metodos-pago-cliente')
export class MetodosPagoClienteController {
  constructor(private readonly metodosPagoClienteService: MetodosPagoClienteService) {}

  @Post()
  create(@Body() createMetodosPagoClienteDto: CreateMetodosPagoClienteDto) {
    return this.metodosPagoClienteService.create(createMetodosPagoClienteDto);
  }

  @Get()
  findAll() {
    return this.metodosPagoClienteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodosPagoClienteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetodosPagoClienteDto: UpdateMetodosPagoClienteDto) {
    return this.metodosPagoClienteService.update(+id, updateMetodosPagoClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodosPagoClienteService.remove(+id);
  }
}
