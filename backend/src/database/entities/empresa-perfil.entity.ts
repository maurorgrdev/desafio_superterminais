import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'empresa_perfis' })
export class EmpresaPerfil {
  @PrimaryGeneratedColumn({
    name: 'id_empresa_perfil',
    type: 'bigint',
  })
  idEmpresaPerfil!: number;

  @Column({ name: 'nome', type: 'varchar', length: 50, unique: true })
  nome!: string;
}

