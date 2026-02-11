import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { AprovarEmpresaDto } from './dto/aprovar-empresa.dto';
import { AtribuirResponsavelDto } from './dto/atribuir-responsavel.dto';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { ReprovarEmpresaDto } from './dto/reprovar-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UploadDocumentoDto } from './dto/upload-documento.dto';
import { EmpresasService } from './empresas.service';

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB ?? '10');
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly service: EmpresasService) {}

  @Post()
  async criar(@Body() dto: CreateEmpresaDto) {
    return this.service.criar(dto);
  }

  @Get()
  async listar(@Query('status') status?: string) {
    return this.service.listar(status);
  }

  @Get(':id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  async atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmpresaDto) {
    return this.service.atualizar(id, dto);
  }

  @Post(':id/aprovar')
  async aprovar(@Param('id', ParseIntPipe) id: number, @Body() dto: AprovarEmpresaDto) {
    return this.service.aprovar(id, dto);
  }

  @Post(':id/reprovar')
  async reprovar(@Param('id', ParseIntPipe) id: number, @Body() dto: ReprovarEmpresaDto) {
    return this.service.reprovar(id, dto);
  }

  @Post(':id/responsaveis')
  async atribuirResponsavel(
    @Param('id', ParseIntPipe) idEmpresa: number,
    @Body() dto: AtribuirResponsavelDto,
  ) {
    return this.service.atribuirResponsavel(idEmpresa, dto);
  }

  @Get(':id/documentos')
  async listarDocumentos(@Param('id', ParseIntPipe) idEmpresa: number) {
    return this.service.listarDocumentos(idEmpresa);
  }

  @Post(':id/documentos')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_UPLOAD_BYTES },
    }),
  )
  async uploadDocumento(
    @Param('id', ParseIntPipe) idEmpresa: number,
    @Body() dto: UploadDocumentoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.uploadDocumento(idEmpresa, dto, file);
  }

  @Get(':id/documentos/:docId/download')
  async download(
    @Param('id', ParseIntPipe) idEmpresa: number,
    @Param('docId', ParseIntPipe) docId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { doc, stream } = await this.service.baixarDocumento(idEmpresa, docId);
    res.setHeader('Content-Type', doc.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(doc.nomeArquivoOriginal)}"`,
    );
    return new StreamableFile(stream);
  }

  @Delete(':id/documentos/:docId')
  async removerDocumento(
    @Param('id', ParseIntPipe) idEmpresa: number,
    @Param('docId', ParseIntPipe) docId: number,
  ) {
    return this.service.removerDocumento(idEmpresa, docId);
  }
}

