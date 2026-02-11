import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UploadDocumentoDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    const v = String(value).toLowerCase();
    return v === 'true' || v === '1' || v === 'on';
  })
  @IsBoolean()
  obrigatorio?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  descricao?: string;
}

