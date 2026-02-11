import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from '../database/entities/empresa.entity';
import { EmpresaDocumento } from '../database/entities/empresa-documento.entity';
import { EmpresaResponsavel } from '../database/entities/empresa-responsavel.entity';
import { Usuario } from '../database/entities/usuario.entity';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, EmpresaDocumento, EmpresaResponsavel, Usuario])],
  controllers: [EmpresasController],
  providers: [EmpresasService],
})
export class EmpresasModule {}

