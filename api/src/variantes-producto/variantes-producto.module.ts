import { Module } from '@nestjs/common';
import { VariantesProductoService } from './variantes-producto.service';
import { VariantesProductoController } from './variantes-producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. Importa TypeOrmModule
import { VariantesProducto } from './entities/variantes-producto.entity';

@Module({
  controllers: [VariantesProductoController],
  providers: [VariantesProductoService],
  imports: [TypeOrmModule.forFeature([VariantesProducto])],
})
export class VariantesProductoModule {}
