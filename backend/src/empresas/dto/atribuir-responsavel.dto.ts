import { IsInt, IsOptional } from 'class-validator';

export class AtribuirResponsavelDto {
  @IsInt()
  id_usuario_externo!: number;

  @IsOptional()
  @IsInt()
  atribuido_por_usuario_id?: number;
}

