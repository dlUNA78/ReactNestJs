
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TypeOrmExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // PostgreSQL foreign key violation error code
    const PG_FOREIGN_KEY_VIOLATION_CODE = '23503';

    if ((exception as any).code === PG_FOREIGN_KEY_VIOLATION_CODE) {
      const detail = (exception as any).detail || 'There was a foreign key constraint violation.';
      this.logger.warn(`Foreign key violation: ${detail} on URL: ${request.url}`);

      let userMessage = 'No se puede eliminar el recurso porque está siendo utilizado por otras entidades.';

      // Custom messages based on table name from detail
      if (detail.includes('productos')) {
        userMessage =
          'Este producto no se puede eliminar porque está en uso en una orden o carrito. ¿Deseas forzar el borrado?';
      } else if (detail.includes('categorias')) {
        userMessage = 'No se puede eliminar la categoría porque está asociada a productos existentes.';
      } else if (detail.includes('marcas')) {
        userMessage = 'No se puede eliminar la marca porque está asociada a productos existentes.';
      } else if (detail.includes('tallas')) {
        userMessage = 'No se puede eliminar la talla porque está asociada a variantes de productos.';
      }

      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: userMessage,
        error: 'Conflict',
      });
    } else {
      // For all other QueryFailedError errors, send a generic 500 error
      this.logger.error(`A database query failed: ${exception.message}`, exception.stack);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error occurred.',
        error: 'Internal Server Error',
      });
    }
  }
}
