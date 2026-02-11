-- Desafio Super Terminais - Schema inicial (PostgreSQL)

-- =========================
-- 1) PERFIS DE EMPRESA
-- =========================
create table if not exists empresa_perfis (
  id_empresa_perfil bigserial primary key,
  nome varchar(50) not null unique
);

insert into empresa_perfis (nome) values
  ('Despachante'),
  ('Beneficiário'),
  ('Consignatário'),
  ('Armador'),
  ('Agente de Carga'),
  ('Transportadora')
on conflict (nome) do nothing;


-- =========================
-- 2) USUÁRIOS (interno/externo)
-- =========================
create table if not exists usuarios (
  id_usuario bigserial primary key,
  tipo_usuario varchar(10) not null check (tipo_usuario in ('INTERNO','EXTERNO')),
  nome varchar(120) not null,
  email varchar(120),

  -- Se quiser simples: string/JSON com permissões (você pode normalizar depois)
  permissoes text,

  created_at timestamptz not null default now()
);


-- =========================
-- 3) EMPRESAS
-- =========================
create table if not exists empresas (
  id_empresa bigserial primary key,

  tipo_pessoa varchar(12) not null
    check (tipo_pessoa in ('JURIDICA','FISICA','ESTRANGEIRA')),

  nome_fantasia varchar(120) not null,
  id_empresa_perfil bigint not null references empresa_perfis(id_empresa_perfil),
  faturamento_direto boolean not null default false,

  -- Jurídica
  razao_social varchar(180),
  cnpj char(14),

  -- Física
  nome_pessoa varchar(180),
  cpf char(11),

  -- Estrangeira
  razao_social_estrangeira varchar(180),
  identificador_estrangeiro varchar(60),

  -- Aprovação
  status_aprovacao varchar(15) not null
    check (status_aprovacao in ('PENDENTE','APROVADA','REPROVADA'))
    default 'PENDENTE',
  motivo_reprovacao varchar(500),

  criado_por_usuario_id bigint not null references usuarios(id_usuario),
  aprovado_por_usuario_id bigint references usuarios(id_usuario),
  aprovado_em timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Regras por tipo de pessoa
  constraint ck_empresa_juridica_campos
    check (
      (tipo_pessoa <> 'JURIDICA')
      or (razao_social is not null and cnpj is not null)
    ),
  constraint ck_empresa_fisica_campos
    check (
      (tipo_pessoa <> 'FISICA')
      or (nome_pessoa is not null and cpf is not null)
    ),
  constraint ck_empresa_estrangeira_campos
    check (
      (tipo_pessoa <> 'ESTRANGEIRA')
      or (
        (coalesce(razao_social_estrangeira, razao_social) is not null)
        and identificador_estrangeiro is not null
      )
    ),

  -- Evita duplicidade (pode ajustar conforme regra real)
  constraint uq_empresas_cnpj unique (cnpj),
  constraint uq_empresas_cpf unique (cpf),
  constraint uq_empresas_id_estrang unique (identificador_estrangeiro)
);

create index if not exists idx_empresas_perfil on empresas(id_empresa_perfil);
create index if not exists idx_empresas_status on empresas(status_aprovacao);
create index if not exists idx_empresas_criado_por on empresas(criado_por_usuario_id);


-- =========================
-- 4) DOCUMENTOS (ANEXOS)
-- =========================
create table if not exists empresa_documentos (
  id_empresa_documento bigserial primary key,
  id_empresa bigint not null references empresas(id_empresa) on delete cascade,

  obrigatorio boolean not null default true,
  descricao varchar(120),

  nome_arquivo_original varchar(255) not null,
  nome_arquivo_armazenado varchar(255) not null, -- uuid.ext
  mime_type varchar(50) not null
    check (mime_type in ('application/pdf','image/png','image/jpeg')),
  tamanho_bytes bigint not null check (tamanho_bytes > 0),

  arquivo_hash_sha256 char(64) not null,

  -- onde está guardado (recomendado)
  storage_driver varchar(10) not null default 'local'
    check (storage_driver in ('local','s3','minio')),
  storage_path varchar(500) not null,

  status varchar(10) not null default 'ATIVO'
    check (status in ('ATIVO','REMOVIDO')),

  created_at timestamptz not null default now(),

  -- evita duplicado por empresa (hash do conteúdo)
  constraint uq_doc_hash_por_empresa unique (id_empresa, arquivo_hash_sha256)
);

create index if not exists idx_docs_empresa on empresa_documentos(id_empresa);
create index if not exists idx_docs_status on empresa_documentos(status);


-- =========================
-- 5) RESPONSÁVEL EXTERNO (vínculo)
-- =========================
create table if not exists empresa_responsaveis (
  id_empresa_responsavel bigserial primary key,

  id_empresa bigint not null references empresas(id_empresa) on delete cascade,
  id_usuario_externo bigint not null references usuarios(id_usuario),

  ativo boolean not null default true,
  atribuido_por_usuario_id bigint references usuarios(id_usuario),
  atribuido_em timestamptz not null default now(),

  -- 1 responsável ativo por empresa (simples e direto)
  constraint uq_responsavel_ativo_por_empresa unique (id_empresa, ativo)
);

