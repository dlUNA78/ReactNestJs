import { IsString, IsNotEmpty, MaxLength, IsInt, IsPositive } from 'class-validator';

export class CreateMetodosPagoClienteDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_cliente_fk: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  token_pasarela: string;
}
