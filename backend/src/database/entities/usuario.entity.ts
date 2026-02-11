import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type TipoUsuario = 'INTERNO' | 'EXTERNO';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({
    name: 'id_usuario',
    type: 'bigint',
  })
  idUsuario!: number;

  @Column({ name: 'tipo_usuario', type: 'varchar', length: 10 })
  tipoUsuario!: TipoUsuario;

  @Column({ name: 'nome', type: 'varchar', length: 120 })
  nome!: string;

  @Column({ name: 'email', type: 'varchar', length: 120, nullable: true })
  email!: string | null;

  @Column({ name: 'permissoes', type: 'text', nullable: true })
  permissoes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}

