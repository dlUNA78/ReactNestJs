import { Module } from '@nestjs/common';
import { DetallesOrdenService } from './detalles-orden.service';
import { DetallesOrdenController } from './detalles-orden.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. Importa TypeOrmModule
import { DetallesOrden } from './entities/detalles-orden.entity';

@Module({
  controllers: [DetallesOrdenController],
  providers: [DetallesOrdenService],
  imports: [TypeOrmModule.forFeature([DetallesOrden])],
})
export class DetallesOrdenModule {}
