import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  IsPositive,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateDireccionDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_cliente_fk: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  calle: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigo_postal: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  pais: string;

  @IsBoolean()
  @IsOptional()
  es_predeterminada?: boolean;
}
