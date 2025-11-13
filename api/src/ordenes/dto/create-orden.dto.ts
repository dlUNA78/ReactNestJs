import {
  IsInt,
  IsPositive,
  IsNumber,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateOrdenDto {
  @IsInt()
  @IsPositive()
  id_cliente_fk: number;

  @IsInt()
  @IsPositive()
  id_direccion_envio_fk: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  total: number;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  estado?: string;
}
