import { IsInt, IsString, Length } from 'class-validator';

export class ReprovarEmpresaDto {
  @IsInt()
  aprovado_por_usuario_id!: number;

  @IsString()
  @Length(3, 500)
  motivo_reprovacao!: string;
}

