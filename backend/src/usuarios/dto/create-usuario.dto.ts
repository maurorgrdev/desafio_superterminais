import { IsEmail, IsIn, IsOptional, IsString, Length } from 'class-validator';

export class CreateUsuarioDto {
  @IsIn(['INTERNO', 'EXTERNO'])
  tipo_usuario!: 'INTERNO' | 'EXTERNO';

  @IsString()
  @Length(2, 120)
  nome!: string;

  @IsOptional()
  @IsEmail()
  @Length(3, 120)
  email?: string;

  @IsOptional()
  @IsString()
  permissoes?: string;
}

