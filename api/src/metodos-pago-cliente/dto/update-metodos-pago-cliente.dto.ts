import { PartialType } from '@nestjs/mapped-types';
import { CreateMetodosPagoClienteDto } from './create-metodos-pago-cliente.dto';

export class UpdateMetodosPagoClienteDto extends PartialType(
  CreateMetodosPagoClienteDto,
) {}
