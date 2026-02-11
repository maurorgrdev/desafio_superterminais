import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaPerfil } from '../database/entities/empresa-perfil.entity';
import { EmpresaPerfisController } from './empresa-perfis.controller';
import { EmpresaPerfisService } from './empresa-perfis.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaPerfil])],
  controllers: [EmpresaPerfisController],
  providers: [EmpresaPerfisService],
  exports: [EmpresaPerfisService],
})
export class EmpresaPerfisModule {}

