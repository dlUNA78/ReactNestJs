import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallesOrdenService } from './detalles-orden.service';
import { CreateDetallesOrdenDto } from './dto/create-detalles-orden.dto';
import { UpdateDetallesOrdenDto } from './dto/update-detalles-orden.dto';

@Controller('detalles-orden')
export class DetallesOrdenController {
  constructor(private readonly detallesOrdenService: DetallesOrdenService) {}

  @Post()
  create(@Body() createDetallesOrdenDto: CreateDetallesOrdenDto) {
    return this.detallesOrdenService.create(createDetallesOrdenDto);
  }

  @Get()
  findAll() {
    return this.detallesOrdenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesOrdenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallesOrdenDto: UpdateDetallesOrdenDto) {
    return this.detallesOrdenService.update(+id, updateDetallesOrdenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesOrdenService.remove(+id);
  }
}
