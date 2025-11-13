import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CarritoItemsService } from './carrito-items.service';
import { CreateCarritoItemDto } from './dto/create-carrito-item.dto';
import { UpdateCarritoItemDto } from './dto/update-carrito-item.dto';

@Controller('carrito-items')
export class CarritoItemsController {
  constructor(private readonly carritoItemsService: CarritoItemsService) {}

  @Post()
  create(@Body() createCarritoItemDto: CreateCarritoItemDto) {
    return this.carritoItemsService.create(createCarritoItemDto);
  }

  @Get()
  findAll() {
    return this.carritoItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carritoItemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCarritoItemDto: UpdateCarritoItemDto) {
    return this.carritoItemsService.update(id, updateCarritoItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carritoItemsService.remove(id);
  }
}
