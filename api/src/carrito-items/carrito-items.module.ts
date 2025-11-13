import { Module } from '@nestjs/common';
import { CarritoItemsService } from './carrito-items.service';
import { CarritoItemsController } from './carrito-items.controller';

@Module({
  controllers: [CarritoItemsController],
  providers: [CarritoItemsService],
})
export class CarritoItemsModule {}
