import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsPositive,
  IsInt,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_base: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_categoria_fk: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_marca_fk: number;

  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  imagen_principal_url?: string;
}
