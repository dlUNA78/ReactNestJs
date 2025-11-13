import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ClientesService } from '../clientes/clientes.service';
import { UsuariosAdminService } from '../usuarios-admin/usuarios-admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientesService: ClientesService,
    private readonly usuariosAdminService: UsuariosAdminService,
  ) {}

  async registerGuest(): Promise<{ id_cliente: number }> {
    const randomEmail = `${uuidv4()}@guest.com`;
    const randomPassword = uuidv4();

    const guest = await this.clientesService.create({
      nombre: 'Invitado',
      email: randomEmail,
      password_hash: randomPassword, // The service will hash this
    });

    return { id_cliente: guest.id_cliente };
  }

  async adminLogin(adminLoginDto: AdminLoginDto) {
    const { username, password_hash } = adminLoginDto;
    const admin = await this.usuariosAdminService.findOneByUsername(username);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      password_hash,
      admin.password_hash,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // The entity serialization will remove the password hash
    return admin;
  }
}
