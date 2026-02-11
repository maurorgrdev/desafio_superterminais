import { API_URL } from './env'
import type { Empresa, EmpresaDocumento, EmpresaPerfil, Usuario } from './types'

type ApiError = Error & { status?: number; payload?: any }

async function readJsonSafely(res: Response) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
    },
  })

  if (!res.ok) {
    const payload = await readJsonSafely(res)
    const err = new Error(
      (payload && (payload.message || payload.error)) ||
        `Erro na API (${res.status})`,
    ) as ApiError
    err.status = res.status
    err.payload = payload
    throw err
  }

  return (await readJsonSafely(res)) as T
}

function toNumber(value: any): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') return Number(value)
  return Number(value)
}

function normalizePerfil(p: any): EmpresaPerfil {
  return {
    ...p,
    idEmpresaPerfil: toNumber(p.idEmpresaPerfil),
  }
}

function normalizeUsuario(u: any): Usuario {
  return {
    ...u,
    idUsuario: toNumber(u.idUsuario),
  }
}

function normalizeEmpresa(e: any): Empresa {
  return {
    ...e,
    idEmpresa: toNumber(e.idEmpresa),
    idEmpresaPerfil: toNumber(e.idEmpresaPerfil),
    criadoPorUsuarioId: toNumber(e.criadoPorUsuarioId),
    aprovadoPorUsuarioId:
      e.aprovadoPorUsuarioId === null ? null : toNumber(e.aprovadoPorUsuarioId),
  }
}

function normalizeDocumento(d: any): EmpresaDocumento {
  return {
    ...d,
    idEmpresaDocumento: toNumber(d.idEmpresaDocumento),
    idEmpresa: toNumber(d.idEmpresa),
    tamanhoBytes: toNumber(d.tamanhoBytes),
  }
}

export const api = {
  perfis: {
    listar(): Promise<EmpresaPerfil[]> {
      return request<any[]>('/empresa-perfis').then((arr) => arr.map(normalizePerfil))
    },
  },

  usuarios: {
    criar(input: {
      tipo_usuario: 'INTERNO' | 'EXTERNO'
      nome: string
      email?: string
    }): Promise<Usuario> {
      return request<any>('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }).then(normalizeUsuario)
    },
  },

  empresas: {
    listar(status?: string): Promise<Empresa[]> {
      const q = status ? `?status=${encodeURIComponent(status)}` : ''
      return request<any[]>(`/empresas${q}`).then((arr) => arr.map(normalizeEmpresa))
    },

    buscar(idEmpresa: number): Promise<Empresa> {
      return request<any>(`/empresas/${idEmpresa}`).then(normalizeEmpresa)
    },

    criar(input: any): Promise<Empresa> {
      return request<any>('/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }).then(normalizeEmpresa)
    },

    documentos: {
      listar(idEmpresa: number): Promise<EmpresaDocumento[]> {
        return request<any[]>(`/empresas/${idEmpresa}/documentos`).then((arr) =>
          arr.map(normalizeDocumento),
        )
      },

      upload(
        idEmpresa: number,
        input: { obrigatorio?: boolean; descricao?: string; file: File },
      ): Promise<EmpresaDocumento> {
        const fd = new FormData()
        if (input.obrigatorio !== undefined) fd.append('obrigatorio', String(input.obrigatorio))
        if (input.descricao) fd.append('descricao', input.descricao)
        fd.append('file', input.file)

        return request<any>(`/empresas/${idEmpresa}/documentos`, {
          method: 'POST',
          body: fd,
        }).then(normalizeDocumento)
      },
    },
  },
}

