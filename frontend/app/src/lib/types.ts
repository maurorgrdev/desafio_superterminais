export type TipoUsuario = 'INTERNO' | 'EXTERNO'

export type Usuario = {
  idUsuario: number
  tipoUsuario: TipoUsuario
  nome: string
  email: string | null
  permissoes: string | null
  createdAt: string
}

export type EmpresaPerfil = {
  idEmpresaPerfil: number
  nome: string
}

export type StatusAprovacao = 'PENDENTE' | 'APROVADA' | 'REPROVADA'
export type TipoPessoa = 'JURIDICA' | 'FISICA' | 'ESTRANGEIRA'

export type Empresa = {
  idEmpresa: number
  tipoPessoa: TipoPessoa
  nomeFantasia: string
  idEmpresaPerfil: number
  faturamentoDireto: boolean
  razaoSocial: string | null
  cnpj: string | null
  nomePessoa: string | null
  cpf: string | null
  razaoSocialEstrangeira: string | null
  identificadorEstrangeiro: string | null
  statusAprovacao: StatusAprovacao
  motivoReprovacao: string | null
  criadoPorUsuarioId: number
  aprovadoPorUsuarioId: number | null
  aprovadoEm: string | null
  createdAt: string
  updatedAt: string
}

export type EmpresaDocumento = {
  idEmpresaDocumento: number
  idEmpresa: number
  obrigatorio: boolean
  descricao: string | null
  nomeArquivoOriginal: string
  nomeArquivoArmazenado: string
  mimeType: string
  tamanhoBytes: number
  arquivoHashSha256: string
  storageDriver: 'local' | 's3' | 'minio'
  storagePath: string
  status: 'ATIVO' | 'REMOVIDO'
  createdAt: string
}

