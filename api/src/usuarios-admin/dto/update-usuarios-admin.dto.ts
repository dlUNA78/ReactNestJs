import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuariosAdminDto } from './create-usuarios-admin.dto';

export class UpdateUsuariosAdminDto extends PartialType(
  CreateUsuariosAdminDto,
) {}
