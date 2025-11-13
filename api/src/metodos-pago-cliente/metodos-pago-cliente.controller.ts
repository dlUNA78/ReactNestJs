import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.metodosPagoClienteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMetodosPagoClienteDto: UpdateMetodosPagoClienteDto) {
    return this.metodosPagoClienteService.update(id, updateMetodosPagoClienteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.metodosPagoClienteService.remove(id);
  }
}
