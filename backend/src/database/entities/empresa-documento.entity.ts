import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from './empresa.entity';

export type StorageDriver = 'local' | 's3' | 'minio';
export type DocumentoStatus = 'ATIVO' | 'REMOVIDO';

@Entity({ name: 'empresa_documentos' })
@Index(['idEmpresa'])
export class EmpresaDocumento {
  @PrimaryGeneratedColumn({
    name: 'id_empresa_documento',
    type: 'bigint',
  })
  idEmpresaDocumento!: number;

  @Column({ name: 'id_empresa', type: 'bigint' })
  idEmpresa!: number;

  @ManyToOne(() => Empresa, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_empresa' })
  empresa!: Empresa;

  @Column({ name: 'obrigatorio', type: 'boolean', default: true })
  obrigatorio!: boolean;

  @Column({ name: 'descricao', type: 'varchar', length: 120, nullable: true })
  descricao!: string | null;

  @Column({ name: 'nome_arquivo_original', type: 'varchar', length: 255 })
  nomeArquivoOriginal!: string;

  @Column({ name: 'nome_arquivo_armazenado', type: 'varchar', length: 255 })
  nomeArquivoArmazenado!: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 50 })
  mimeType!: string;

  @Column({ name: 'tamanho_bytes', type: 'bigint' })
  tamanhoBytes!: number;

  @Column({ name: 'arquivo_hash_sha256', type: 'char', length: 64 })
  arquivoHashSha256!: string;

  @Column({ name: 'storage_driver', type: 'varchar', length: 10, default: 'local' })
  storageDriver!: StorageDriver;

  @Column({ name: 'storage_path', type: 'varchar', length: 500 })
  storagePath!: string;

  @Column({ name: 'status', type: 'varchar', length: 10, default: 'ATIVO' })
  status!: DocumentoStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}

