import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TypeOrmExceptionFilter } from './typeorm-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend application
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  // Set a global prefix for all routes
  // app.setGlobalPrefix('api');

  // Use a global validation pipe to validate all incoming request payloads
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip away properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Register the global exception filter for TypeORM errors
  app.useGlobalFilters(new TypeOrmExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${process.env.PORT ?? 3000}`);
}
bootstrap();
