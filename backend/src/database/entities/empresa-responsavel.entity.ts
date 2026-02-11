import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from './empresa.entity';
import { Usuario } from './usuario.entity';

@Entity({ name: 'empresa_responsaveis' })
export class EmpresaResponsavel {
  @PrimaryGeneratedColumn({
    name: 'id_empresa_responsavel',
    type: 'bigint',
  })
  idEmpresaResponsavel!: number;

  @Column({ name: 'id_empresa', type: 'bigint' })
  idEmpresa!: number;

  @ManyToOne(() => Empresa, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_empresa' })
  empresa!: Empresa;

  @Column({ name: 'id_usuario_externo', type: 'bigint' })
  idUsuarioExterno!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario_externo' })
  usuarioExterno!: Usuario;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @Column({
    name: 'atribuido_por_usuario_id',
    type: 'bigint',
    nullable: true,
  })
  atribuidoPorUsuarioId!: number | null;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'atribuido_por_usuario_id' })
  atribuidoPor!: Usuario | null;

  @Column({ name: 'atribuido_em', type: 'timestamptz', default: () => 'now()' })
  atribuidoEm!: Date;
}

