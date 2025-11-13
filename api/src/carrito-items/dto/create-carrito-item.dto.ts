import { IsInt, IsPositive, Min } from 'class-validator';

export class CreateCarritoItemDto {
  @IsInt()
  @IsPositive()
  id_cliente_fk: number;

  @IsInt()
  @IsPositive()
  id_variante_fk: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}
