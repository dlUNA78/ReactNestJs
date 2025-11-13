import { IsString, IsNotEmpty, MaxLength, IsInt, IsPositive } from 'class-validator';

export class CreateUsuariosAdminDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password_hash: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_rol_fk: number;
}
