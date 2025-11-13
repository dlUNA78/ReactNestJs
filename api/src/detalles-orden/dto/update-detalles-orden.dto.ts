import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallesOrdenDto } from './create-detalles-orden.dto';

export class UpdateDetallesOrdenDto extends PartialType(
  CreateDetallesOrdenDto,
) {}
