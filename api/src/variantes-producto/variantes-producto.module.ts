import { Module } from '@nestjs/common';
import { VariantesProductoService } from './variantes-producto.service';
import { VariantesProductoController } from './variantes-producto.controller';

@Module({
  controllers: [VariantesProductoController],
  providers: [VariantesProductoService],
})
export class VariantesProductoModule {}
