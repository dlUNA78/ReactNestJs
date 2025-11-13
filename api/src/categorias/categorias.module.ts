import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. Importa TypeOrmModule
import { Categoria } from './entities/categoria.entity';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  imports: [TypeOrmModule.forFeature([Categoria])],
})
export class CategoriasModule {}
