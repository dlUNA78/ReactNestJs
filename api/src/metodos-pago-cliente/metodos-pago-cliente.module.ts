import { Module } from '@nestjs/common';
import { MetodosPagoClienteService } from './metodos-pago-cliente.service';
import { MetodosPagoClienteController } from './metodos-pago-cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. Importa TypeOrmModule
import { MetodosPagoCliente } from './entities/metodos-pago-cliente.entity';

@Module({
  controllers: [MetodosPagoClienteController],
  providers: [MetodosPagoClienteService],
  imports: [TypeOrmModule.forFeature([MetodosPagoCliente])],
})
export class MetodosPagoClienteModule {}
