# Desafio Super Terminais

Stack com **Frontend (React/Vite/Tailwind)** + **Backend (NestJS)** + **PostgreSQL**, tudo via **Docker**.

## Como rodar

Na raiz do projeto:

```bash
docker compose up --build
```

Arquivos de ambiente (recomendado):

- `backend/.env` (baseado em `backend/.env.example`)
- `frontend/app/.env` (baseado em `frontend/app/.env.example`) — no Vite as vars públicas precisam começar com `VITE_`
- `.env` na raiz é **opcional** (apenas para parametrizar o Docker Compose, se você decidir usar `${...}` no `docker-compose.yml`)

Serviços:

- Frontend: `http://localhost:5173`
- API (Nest): `http://localhost:3000`
- Healthcheck API: `GET http://localhost:3000/health`

Para parar:

```bash
docker compose down
```

Para zerar o banco:

```bash
docker compose down -v
```

## Endpoints (API)

### Perfis de empresa

- `GET /empresa-perfis`

### Usuários

- `POST /usuarios`
- `GET /usuarios`
- `GET /usuarios/:id`

### Empresas

- `POST /empresas`
- `GET /empresas?status=PENDENTE|APROVADA|REPROVADA`
- `GET /empresas/:id`
- `PATCH /empresas/:id`
- `POST /empresas/:id/aprovar`
- `POST /empresas/:id/reprovar`
- `POST /empresas/:id/responsaveis`

### Documentos

- `GET /empresas/:id/documentos`
- `POST /empresas/:id/documentos` (multipart, campo `file`)
- `GET /empresas/:id/documentos/:docId/download`
- `DELETE /empresas/:id/documentos/:docId` (soft delete: status `REMOVIDO`)

## Upload de arquivos (regras)

- Tipos aceitos: `application/pdf`, `image/png`, `image/jpeg`
- Tamanho máximo: `MAX_UPLOAD_MB` (default 10MB)
- Deduplicação: SHA-256 por empresa (`(id_empresa, arquivo_hash_sha256)`)
- Storage local via volume: `./storage/empresas/{idEmpresa}/documentos/{uuid}.{ext}`

