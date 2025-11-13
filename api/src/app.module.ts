import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { MarcasModule } from './marcas/marcas.module';
import { TallasModule } from './tallas/tallas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { UsuariosAdminModule } from './usuarios-admin/usuarios-admin.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { VariantesProductoModule } from './variantes-producto/variantes-producto.module';
import { DireccionesModule } from './direcciones/direcciones.module';
import { MetodosPagoClienteModule } from './metodos-pago-cliente/metodos-pago-cliente.module';
import { CarritoItemsModule } from './carrito-items/carrito-items.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { DetallesOrdenModule } from './detalles-orden/detalles-orden.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false, // IMPORTANT: Never use TRUE in production
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    RolesModule,
    MarcasModule,
    TallasModule,
    CategoriasModule,
    UsuariosAdminModule,
    ClientesModule,
    ProductosModule,
    VariantesProductoModule,
    DireccionesModule,
    MetodosPagoClienteModule,
    CarritoItemsModule,
    OrdenesModule,
    DetallesOrdenModule,
    AuthModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
