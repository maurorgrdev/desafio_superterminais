import { Controller, Get } from '@nestjs/common';
import { EmpresaPerfisService } from './empresa-perfis.service';

@Controller('empresa-perfis')
export class EmpresaPerfisController {
  constructor(private readonly service: EmpresaPerfisService) {}

  @Get()
  async listar() {
    return this.service.listar();
  }
}

