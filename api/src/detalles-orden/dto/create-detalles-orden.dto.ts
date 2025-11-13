import { IsInt, IsPositive, IsNumber, Min } from 'class-validator';

export class CreateDetallesOrdenDto {
  @IsInt()
  @IsPositive()
  id_orden_fk: number;

  @IsInt()
  @IsPositive()
  id_variante_fk: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_unitario_snapshot: number;
}
