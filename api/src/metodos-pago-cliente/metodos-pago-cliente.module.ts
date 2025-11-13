import { Module } from '@nestjs/common';
import { MetodosPagoClienteService } from './metodos-pago-cliente.service';
import { MetodosPagoClienteController } from './metodos-pago-cliente.controller';

@Module({
  controllers: [MetodosPagoClienteController],
  providers: [MetodosPagoClienteService],
})
export class MetodosPagoClienteModule {}
