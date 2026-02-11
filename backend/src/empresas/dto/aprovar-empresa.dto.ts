import { IsInt } from 'class-validator';

export class AprovarEmpresaDto {
  @IsInt()
  aprovado_por_usuario_id!: number;
}

