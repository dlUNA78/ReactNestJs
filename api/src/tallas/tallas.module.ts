import { Module } from '@nestjs/common';
import { TallasService } from './tallas.service';
import { TallasController } from './tallas.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. Importa TypeOrmModule
import { Talla } from './entities/talla.entity';

@Module({
  controllers: [TallasController],
  providers: [TallasService],
  imports: [TypeOrmModule.forFeature([Talla])],
})
export class TallasModule {}
