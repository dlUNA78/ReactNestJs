import { Module } from '@nestjs/common';
import { DetallesOrdenService } from './detalles-orden.service';
import { DetallesOrdenController } from './detalles-orden.controller';

@Module({
  controllers: [DetallesOrdenController],
  providers: [DetallesOrdenService],
})
export class DetallesOrdenModule {}
