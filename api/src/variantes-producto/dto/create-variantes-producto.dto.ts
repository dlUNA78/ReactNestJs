import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  IsPositive,
  IsOptional,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateVariantesProductoDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_producto_fk: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_talla_fk: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @IsInt()
  @Min(0)
  stock_disponible: number;

  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  imagen_url?: string;
}
