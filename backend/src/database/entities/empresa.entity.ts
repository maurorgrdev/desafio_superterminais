import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmpresaPerfil } from './empresa-perfil.entity';
import { Usuario } from './usuario.entity';

export type TipoPessoa = 'JURIDICA' | 'FISICA' | 'ESTRANGEIRA';
export type StatusAprovacao = 'PENDENTE' | 'APROVADA' | 'REPROVADA';

@Entity({ name: 'empresas' })
export class Empresa {
  @PrimaryGeneratedColumn({
    name: 'id_empresa',
    type: 'bigint',
  })
  idEmpresa!: number;

  @Column({ name: 'tipo_pessoa', type: 'varchar', length: 12 })
  tipoPessoa!: TipoPessoa;

  @Column({ name: 'nome_fantasia', type: 'varchar', length: 120 })
  nomeFantasia!: string;

  @Column({
    name: 'id_empresa_perfil',
    type: 'bigint',
  })
  idEmpresaPerfil!: number;

  @ManyToOne(() => EmpresaPerfil)
  @JoinColumn({ name: 'id_empresa_perfil' })
  perfil!: EmpresaPerfil;

  @Column({ name: 'faturamento_direto', type: 'boolean', default: false })
  faturamentoDireto!: boolean;

  @Column({ name: 'razao_social', type: 'varchar', length: 180, nullable: true })
  razaoSocial!: string | null;

  @Column({ name: 'cnpj', type: 'char', length: 14, nullable: true })
  cnpj!: string | null;

  @Column({ name: 'nome_pessoa', type: 'varchar', length: 180, nullable: true })
  nomePessoa!: string | null;

  @Column({ name: 'cpf', type: 'char', length: 11, nullable: true })
  cpf!: string | null;

  @Column({
    name: 'razao_social_estrangeira',
    type: 'varchar',
    length: 180,
    nullable: true,
  })
  razaoSocialEstrangeira!: string | null;

  @Column({
    name: 'identificador_estrangeiro',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  identificadorEstrangeiro!: string | null;

  @Column({ name: 'status_aprovacao', type: 'varchar', length: 15, default: 'PENDENTE' })
  statusAprovacao!: StatusAprovacao;

  @Column({ name: 'motivo_reprovacao', type: 'varchar', length: 500, nullable: true })
  motivoReprovacao!: string | null;

  @Column({
    name: 'criado_por_usuario_id',
    type: 'bigint',
  })
  criadoPorUsuarioId!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'criado_por_usuario_id' })
  criadoPor!: Usuario;

  @Column({
    name: 'aprovado_por_usuario_id',
    type: 'bigint',
    nullable: true,
  })
  aprovadoPorUsuarioId!: number | null;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'aprovado_por_usuario_id' })
  aprovadoPor!: Usuario | null;

  @Column({ name: 'aprovado_em', type: 'timestamptz', nullable: true })
  aprovadoEm!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}

