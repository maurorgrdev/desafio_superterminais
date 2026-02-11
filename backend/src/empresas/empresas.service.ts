import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import crypto, { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join, posix } from 'path';
import { Repository } from 'typeorm';
import { Empresa } from '../database/entities/empresa.entity';
import { EmpresaDocumento } from '../database/entities/empresa-documento.entity';
import { EmpresaResponsavel } from '../database/entities/empresa-responsavel.entity';
import { Usuario } from '../database/entities/usuario.entity';
import { AprovarEmpresaDto } from './dto/aprovar-empresa.dto';
import { AtribuirResponsavelDto } from './dto/atribuir-responsavel.dto';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { ReprovarEmpresaDto } from './dto/reprovar-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UploadDocumentoDto } from './dto/upload-documento.dto';

const ALLOWED_MIME = new Set(['application/pdf', 'image/png', 'image/jpeg']);

function normalizeOriginalName(name: string) {
  // evita coisas esquisitas (path traversal / chars de controle)
  return name.replace(/[\r\n\t]/g, ' ').replace(/[\\/]/g, '_').slice(0, 255);
}

function mimeToExt(mime: string) {
  if (mime === 'application/pdf') return '.pdf';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/jpeg') return '.jpg';
  return '';
}

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa) private readonly empresasRepo: Repository<Empresa>,
    @InjectRepository(EmpresaDocumento)
    private readonly docsRepo: Repository<EmpresaDocumento>,
    @InjectRepository(EmpresaResponsavel)
    private readonly respRepo: Repository<EmpresaResponsavel>,
    @InjectRepository(Usuario) private readonly usuariosRepo: Repository<Usuario>,
    private readonly config: ConfigService,
  ) {}

  async criar(dto: CreateEmpresaDto) {
    // validações “extra” para regras por tipo (espelha os CHECKs do banco)
    if (dto.tipo_pessoa === 'JURIDICA') {
      if (!dto.razao_social?.trim() || !dto.cnpj?.trim()) {
        throw new BadRequestException('Para empresa JURIDICA informe razao_social e cnpj.');
      }
    }
    if (dto.tipo_pessoa === 'FISICA') {
      if (!dto.nome_pessoa?.trim() || !dto.cpf?.trim()) {
        throw new BadRequestException('Para empresa FISICA informe nome_pessoa e cpf.');
      }
    }
    if (dto.tipo_pessoa === 'ESTRANGEIRA') {
      if (!dto.identificador_estrangeiro?.trim()) {
        throw new BadRequestException('Para empresa ESTRANGEIRA informe identificador_estrangeiro.');
      }
      const temRazao = Boolean(dto.razao_social_estrangeira?.trim() || dto.razao_social?.trim());
      if (!temRazao) {
        throw new BadRequestException(
          'Para empresa ESTRANGEIRA informe razao_social_estrangeira ou razao_social.',
        );
      }
    }

    // garante usuário criador existente
    const criador = await this.usuariosRepo.findOne({
      where: { idUsuario: dto.criado_por_usuario_id },
    });
    if (!criador) throw new BadRequestException('criado_por_usuario_id inválido.');

    const entity = this.empresasRepo.create({
      tipoPessoa: dto.tipo_pessoa,
      nomeFantasia: dto.nome_fantasia,
      idEmpresaPerfil: dto.id_empresa_perfil,
      faturamentoDireto: dto.faturamento_direto ?? false,
      razaoSocial: dto.razao_social ?? null,
      cnpj: dto.cnpj ?? null,
      nomePessoa: dto.nome_pessoa ?? null,
      cpf: dto.cpf ?? null,
      razaoSocialEstrangeira: dto.razao_social_estrangeira ?? null,
      identificadorEstrangeiro: dto.identificador_estrangeiro ?? null,
      criadoPorUsuarioId: dto.criado_por_usuario_id,
      statusAprovacao: 'PENDENTE',
      motivoReprovacao: null,
      aprovadoPorUsuarioId: null,
      aprovadoEm: null,
    });

    try {
      return await this.empresasRepo.save(entity);
    } catch (e: any) {
      // uniques: cnpj/cpf/identificador_estrangeiro
      throw new ConflictException('Já existe uma empresa com esses identificadores.');
    }
  }

  async listar(status?: string) {
    const where = status ? { statusAprovacao: status as any } : {};
    return this.empresasRepo.find({
      where,
      order: { idEmpresa: 'DESC' },
    });
  }

  async buscarPorId(id: number) {
    const empresa = await this.empresasRepo.findOne({ where: { idEmpresa: id } });
    if (!empresa) throw new NotFoundException('Empresa não encontrada.');
    return empresa;
  }

  async atualizar(id: number, dto: UpdateEmpresaDto) {
    const empresa = await this.buscarPorId(id);

    if (dto.tipo_pessoa === 'JURIDICA') {
      if (!dto.razao_social?.trim() || !dto.cnpj?.trim()) {
        throw new BadRequestException('Para empresa JURIDICA informe razao_social e cnpj.');
      }
    }
    if (dto.tipo_pessoa === 'FISICA') {
      if (!dto.nome_pessoa?.trim() || !dto.cpf?.trim()) {
        throw new BadRequestException('Para empresa FISICA informe nome_pessoa e cpf.');
      }
    }
    if (dto.tipo_pessoa === 'ESTRANGEIRA') {
      if (!dto.identificador_estrangeiro?.trim()) {
        throw new BadRequestException('Para empresa ESTRANGEIRA informe identificador_estrangeiro.');
      }
      const temRazao = Boolean(dto.razao_social_estrangeira?.trim() || dto.razao_social?.trim());
      if (!temRazao) {
        throw new BadRequestException(
          'Para empresa ESTRANGEIRA informe razao_social_estrangeira ou razao_social.',
        );
      }
    }

    Object.assign(empresa, {
      tipoPessoa: dto.tipo_pessoa ?? empresa.tipoPessoa,
      nomeFantasia: dto.nome_fantasia ?? empresa.nomeFantasia,
      idEmpresaPerfil: dto.id_empresa_perfil ?? empresa.idEmpresaPerfil,
      faturamentoDireto: dto.faturamento_direto ?? empresa.faturamentoDireto,
      razaoSocial: dto.razao_social ?? empresa.razaoSocial,
      cnpj: dto.cnpj ?? empresa.cnpj,
      nomePessoa: dto.nome_pessoa ?? empresa.nomePessoa,
      cpf: dto.cpf ?? empresa.cpf,
      razaoSocialEstrangeira: dto.razao_social_estrangeira ?? empresa.razaoSocialEstrangeira,
      identificadorEstrangeiro: dto.identificador_estrangeiro ?? empresa.identificadorEstrangeiro,
      criadoPorUsuarioId: dto.criado_por_usuario_id ?? empresa.criadoPorUsuarioId,
    });

    try {
      return await this.empresasRepo.save(empresa);
    } catch {
      throw new ConflictException('Não foi possível atualizar a empresa (conflito/validação).');
    }
  }

  async aprovar(id: number, dto: AprovarEmpresaDto) {
    const empresa = await this.buscarPorId(id);
    const aprovador = await this.usuariosRepo.findOne({
      where: { idUsuario: dto.aprovado_por_usuario_id },
    });
    if (!aprovador) throw new BadRequestException('aprovado_por_usuario_id inválido.');

    empresa.statusAprovacao = 'APROVADA';
    empresa.motivoReprovacao = null;
    empresa.aprovadoPorUsuarioId = dto.aprovado_por_usuario_id;
    empresa.aprovadoEm = new Date();
    return this.empresasRepo.save(empresa);
  }

  async reprovar(id: number, dto: ReprovarEmpresaDto) {
    const empresa = await this.buscarPorId(id);
    const aprovador = await this.usuariosRepo.findOne({
      where: { idUsuario: dto.aprovado_por_usuario_id },
    });
    if (!aprovador) throw new BadRequestException('aprovado_por_usuario_id inválido.');

    empresa.statusAprovacao = 'REPROVADA';
    empresa.motivoReprovacao = dto.motivo_reprovacao;
    empresa.aprovadoPorUsuarioId = dto.aprovado_por_usuario_id;
    empresa.aprovadoEm = new Date();
    return this.empresasRepo.save(empresa);
  }

  async atribuirResponsavel(idEmpresa: number, dto: AtribuirResponsavelDto) {
    await this.buscarPorId(idEmpresa);

    const externo = await this.usuariosRepo.findOne({
      where: { idUsuario: dto.id_usuario_externo },
    });
    if (!externo) throw new BadRequestException('id_usuario_externo inválido.');

    if (dto.atribuido_por_usuario_id) {
      const atribuinte = await this.usuariosRepo.findOne({
        where: { idUsuario: dto.atribuido_por_usuario_id },
      });
      if (!atribuinte) throw new BadRequestException('atribuido_por_usuario_id inválido.');
    }

    // desativa responsável ativo anterior (se existir)
    await this.respRepo.update({ idEmpresa, ativo: true }, { ativo: false });

    const novo = this.respRepo.create({
      idEmpresa,
      idUsuarioExterno: dto.id_usuario_externo,
      ativo: true,
      atribuidoPorUsuarioId: dto.atribuido_por_usuario_id ?? null,
      atribuidoEm: new Date(),
    });
    return this.respRepo.save(novo);
  }

  async listarDocumentos(idEmpresa: number) {
    await this.buscarPorId(idEmpresa);
    return this.docsRepo.find({
      where: { idEmpresa },
      order: { idEmpresaDocumento: 'DESC' },
    });
  }

  async removerDocumento(idEmpresa: number, docId: number) {
    await this.buscarPorId(idEmpresa);
    const doc = await this.docsRepo.findOne({
      where: { idEmpresaDocumento: docId, idEmpresa },
    });
    if (!doc) throw new NotFoundException('Documento não encontrado.');
    doc.status = 'REMOVIDO';
    return this.docsRepo.save(doc);
  }

  async uploadDocumento(idEmpresa: number, dto: UploadDocumentoDto, file?: Express.Multer.File) {
    await this.buscarPorId(idEmpresa);
    if (!file) throw new BadRequestException('Arquivo é obrigatório.');

    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo inválido. Aceito: pdf, png, jpg/jpeg.');
    }

    const maxMb = Number(this.config.get<string>('MAX_UPLOAD_MB', '10'));
    const maxBytes = maxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException(`Arquivo excede o limite de ${maxMb}MB.`);
    }

    const hash = createHash('sha256').update(file.buffer).digest('hex');

    const existente = await this.docsRepo.findOne({
      where: { idEmpresa, arquivoHashSha256: hash },
    });
    if (existente) {
      // dedupe: retorna o existente (ou pode lançar erro; aqui fica amigável pro front)
      return existente;
    }

    const ext = mimeToExt(file.mimetype) || extname(file.originalname) || '';
    const uuid = crypto.randomUUID();
    const storedName = `${uuid}${ext}`;

    // path relativo no banco (não expõe caminho real)
    const relative = posix.join('empresas', String(idEmpresa), 'documentos', storedName);
    const storageRoot = this.config.get<string>('STORAGE_ROOT', join(process.cwd(), 'storage'));
    const absolute = join(storageRoot, 'empresas', String(idEmpresa), 'documentos', storedName);

    await mkdir(join(storageRoot, 'empresas', String(idEmpresa), 'documentos'), { recursive: true });
    await writeFile(absolute, file.buffer);

    const doc = this.docsRepo.create({
      idEmpresa,
      obrigatorio: dto.obrigatorio ?? true,
      descricao: dto.descricao ?? null,
      nomeArquivoOriginal: normalizeOriginalName(file.originalname),
      nomeArquivoArmazenado: storedName,
      mimeType: file.mimetype,
      tamanhoBytes: file.size,
      arquivoHashSha256: hash,
      storageDriver: 'local',
      storagePath: relative,
      status: 'ATIVO',
    });

    try {
      return await this.docsRepo.save(doc);
    } catch {
      // se concorrência, unique pode estourar aqui
      throw new ConflictException('Documento já existe para esta empresa (deduplicação).');
    }
  }

  async baixarDocumento(idEmpresa: number, docId: number) {
    await this.buscarPorId(idEmpresa);
    const doc = await this.docsRepo.findOne({
      where: { idEmpresaDocumento: docId, idEmpresa },
    });
    if (!doc) throw new NotFoundException('Documento não encontrado.');

    const storageRoot = this.config.get<string>('STORAGE_ROOT', join(process.cwd(), 'storage'));
    const absolute = join(storageRoot, ...doc.storagePath.split('/'));
    const stream = createReadStream(absolute);

    return { doc, stream };
  }
}

