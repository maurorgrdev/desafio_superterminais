import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../database/entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async criar(dto: CreateUsuarioDto) {
    try {
      const entity = this.repo.create({
        tipoUsuario: dto.tipo_usuario,
        nome: dto.nome,
        email: dto.email ?? null,
        permissoes: dto.permissoes ?? null,
      });
      return await this.repo.save(entity);
    } catch (e: any) {
      // email não tem unique, mas pode haver outras violações (checks etc.)
      throw new ConflictException('Não foi possível criar o usuário.');
    }
  }

  async listar() {
    return this.repo.find({ order: { idUsuario: 'DESC' } });
  }

  async buscarPorId(id: number) {
    return this.repo.findOne({ where: { idUsuario: id } });
  }
}

