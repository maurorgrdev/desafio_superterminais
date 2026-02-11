import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateEmpresaDto {
  @IsIn(['JURIDICA', 'FISICA', 'ESTRANGEIRA'])
  tipo_pessoa!: 'JURIDICA' | 'FISICA' | 'ESTRANGEIRA';

  @IsString()
  @Length(2, 120)
  nome_fantasia!: string;

  @IsInt()
  id_empresa_perfil!: number;

  @IsOptional()
  @IsBoolean()
  faturamento_direto?: boolean;

  @IsOptional()
  @IsString()
  @Length(2, 180)
  razao_social?: string;

  @ValidateIf((o) => o.tipo_pessoa === 'JURIDICA')
  @IsString()
  @Length(14, 14)
  cnpj?: string;

  @ValidateIf((o) => o.tipo_pessoa === 'FISICA')
  @IsString()
  @Length(2, 180)
  nome_pessoa?: string;

  @ValidateIf((o) => o.tipo_pessoa === 'FISICA')
  @IsString()
  @Length(11, 11)
  cpf?: string;

  @ValidateIf((o) => o.tipo_pessoa === 'ESTRANGEIRA')
  @IsOptional()
  @IsString()
  @Length(2, 180)
  razao_social_estrangeira?: string;

  @ValidateIf((o) => o.tipo_pessoa === 'ESTRANGEIRA')
  @IsString()
  @Length(2, 60)
  identificador_estrangeiro?: string;

  @IsInt()
  criado_por_usuario_id!: number;
}

