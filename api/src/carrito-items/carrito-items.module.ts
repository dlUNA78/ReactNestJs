import { Module } from '@nestjs/common';
import { CarritoItemsService } from './carrito-items.service';
import { CarritoItemsController } from './carrito-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. Importa TypeOrmModule
import { CarritoItem } from './entities/carrito-item.entity';

@Module({
  controllers: [CarritoItemsController],
  providers: [CarritoItemsService],
  imports: [TypeOrmModule.forFeature([CarritoItem])],
})
export class CarritoItemsModule {}
