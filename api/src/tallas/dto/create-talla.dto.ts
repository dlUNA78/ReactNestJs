import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTallaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  nombre_talla: string;
}
