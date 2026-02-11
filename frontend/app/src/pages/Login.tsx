import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { setSession } from '../lib/session'

export function Login() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<'EXTERNO' | 'INTERNO'>('EXTERNO')
  const [serial, setSerial] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const emailSugestao = useMemo(() => {
    const safe = serial.trim() ? serial.trim().toLowerCase().replace(/\s+/g, '-') : 'demo'
    return `${safe}@portalst.local`
  }, [serial])

  async function handleLogin() {
    setErro(null)
    setLoading(true)
    try {
      const user = await api.usuarios.criar({
        tipo_usuario: tipo,
        nome: tipo === 'EXTERNO' ? 'Usuário Externo' : 'Usuário Interno',
        email: emailSugestao,
      })
      setSession({ idUsuario: user.idUsuario, tipoUsuario: user.tipoUsuario, nome: user.nome })
      navigate('/inicio')
    } catch (e: any) {
      setErro(e?.message || 'Falha ao autenticar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(1200px_600px_at_50%_0%,rgba(96,165,250,0.20),transparent_60%),linear-gradient(180deg,#F7FAFF_0%,#EEF4FF_100%)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] rounded-[14px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] border border-slate-100 px-8 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-[#1D4ED8] flex items-center justify-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8 3h6l4 4v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                stroke="white"
                strokeWidth="1.7"
              />
              <path
                d="M14 3v5h5"
                stroke="white"
                strokeWidth="1.7"
              />
              <path
                d="M9 12h6M9 16h6"
                stroke="white"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="mt-4 text-[22px] font-semibold text-slate-900">
            Portal ST
          </h1>
          <p className="mt-1 text-[12px] text-slate-500">
            Sistema de Cadastro de Empresas
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-[12px] font-medium text-slate-700">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z"
                  stroke="#64748B"
                  strokeWidth="1.6"
                />
                <path
                  d="M9.5 12l1.8 1.8L15.7 9.4"
                  stroke="#64748B"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Número de Série do Certificado
            </label>

            <input
              className="mt-2 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2.5 text-[12px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
              placeholder="Ex: ABC123456789"
              inputMode="text"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
            />

            <p className="mt-2 text-[11px] text-slate-400">
              Simulação de autenticação por certificado digital
            </p>
          </div>

          <div>
            <p className="text-[12px] font-medium text-slate-700">
              Tipo de Usuário
            </p>

            <div className="mt-2 space-y-2 text-[12px] text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === 'EXTERNO'}
                  onChange={() => setTipo('EXTERNO')}
                  className="h-4 w-4 accent-slate-900"
                />
                Externo (Empresas)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === 'INTERNO'}
                  onChange={() => setTipo('INTERNO')}
                  className="h-4 w-4 accent-slate-900"
                />
                Interno (Administrador)
              </label>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-2 w-full rounded-[10px] bg-[#0B1020] py-2.5 text-[12px] font-medium text-white shadow-[0_8px_18px_rgba(15,23,42,0.25)] hover:bg-[#0A0E1A] active:bg-[#070B14]"
          >
            {loading ? 'Entrando...' : 'Entrar com Certificado'}
          </button>

          {erro ? (
            <div className="rounded-[10px] bg-red-50 px-4 py-3 text-[11px] leading-relaxed text-red-800 border border-red-100">
              {erro}
            </div>
          ) : null}

          <div className="rounded-[10px] bg-[#EAF2FF] px-4 py-3 text-[11px] leading-relaxed text-[#1E3A8A]">
            <span className="font-semibold">Desenvolvimento:</span> Esta é uma
            simulação de autenticação por certificado digital. Em produção, o
            certificado seria validado pelo servidor.
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-900">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </main>
  )
}

