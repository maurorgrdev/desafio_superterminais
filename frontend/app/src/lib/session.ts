import type { TipoUsuario } from './types'

const KEY = 'st_session_v1'

export type Session = {
  idUsuario: number
  tipoUsuario: TipoUsuario
  nome: string
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed?.idUsuario || !parsed?.tipoUsuario) return null
    return parsed
  } catch {
    return null
  }
}

export function setSession(session: Session) {
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(KEY)
}

