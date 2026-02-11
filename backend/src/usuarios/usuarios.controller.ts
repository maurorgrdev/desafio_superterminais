import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Post()
  async criar(@Body() dto: CreateUsuarioDto) {
    return this.service.criar(dto);
  }

  @Get()
  async listar() {
    return this.service.listar();
  }

  @Get(':id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarPorId(id);
  }
}

