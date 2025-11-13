import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { VariantesProductoService } from './variantes-producto.service';
import { CreateVariantesProductoDto } from './dto/create-variantes-producto.dto';
import { UpdateVariantesProductoDto } from './dto/update-variantes-producto.dto';

@Controller('variantes-producto')
export class VariantesProductoController {
  constructor(private readonly variantesProductoService: VariantesProductoService) {}

  @Post()
  create(@Body() createVariantesProductoDto: CreateVariantesProductoDto) {
    return this.variantesProductoService.create(createVariantesProductoDto);
  }

  @Get()
  findAll() {
    return this.variantesProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantesProductoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVariantesProductoDto: UpdateVariantesProductoDto) {
    return this.variantesProductoService.update(id, updateVariantesProductoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.variantesProductoService.remove(id);
  }
}
