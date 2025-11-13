import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosAdminService } from './usuarios-admin.service';
import { UsuariosAdminController } from './usuarios-admin.controller';
import { UsuariosAdmin } from './entities/usuarios-admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuariosAdmin])],
  controllers: [UsuariosAdminController],
  providers: [UsuariosAdminService],
  exports: [UsuariosAdminService],
})
export class UsuariosAdminModule {}
