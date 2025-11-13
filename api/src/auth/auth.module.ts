import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientesModule } from '../clientes/clientes.module';
import { UsuariosAdminModule } from '../usuarios-admin/usuarios-admin.module';

@Module({
  imports: [ClientesModule, UsuariosAdminModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
