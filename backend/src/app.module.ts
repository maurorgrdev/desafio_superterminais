import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaPerfil } from './database/entities/empresa-perfil.entity';
import { Usuario } from './database/entities/usuario.entity';
import { Empresa } from './database/entities/empresa.entity';
import { EmpresaDocumento } from './database/entities/empresa-documento.entity';
import { EmpresaResponsavel } from './database/entities/empresa-responsavel.entity';
import { EmpresaPerfisModule } from './empresa-perfis/empresa-perfis.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EmpresasModule } from './empresas/empresas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '5432')),
        database: config.get<string>('DB_NAME', 'desafio'),
        username: config.get<string>('DB_USER', 'app'),
        password: config.get<string>('DB_PASS', 'app'),
        entities: [EmpresaPerfil, Usuario, Empresa, EmpresaDocumento, EmpresaResponsavel],
        synchronize: false,
        logging: config.get<string>('NODE_ENV', 'development') !== 'production',
      }),
    }),
    EmpresaPerfisModule,
    UsuariosModule,
    EmpresasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
