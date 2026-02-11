import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresaPerfil } from '../database/entities/empresa-perfil.entity';

@Injectable()
export class EmpresaPerfisService {
  constructor(
    @InjectRepository(EmpresaPerfil)
    private readonly repo: Repository<EmpresaPerfil>,
  ) {}

  async listar() {
    return this.repo.find({ order: { nome: 'ASC' } });
  }
}

