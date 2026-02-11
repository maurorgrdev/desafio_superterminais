import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import type { Empresa, EmpresaPerfil } from '../lib/types'
import { clearSession, getSession } from '../lib/session'

function Stat({
  value,
  label,
  colorClass,
}: {
  value: string
  label: string
  colorClass: string
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`text-[18px] font-semibold ${colorClass}`}>{value}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  )
}

function formatTipoPessoa(tipo: Empresa['tipoPessoa']) {
  if (tipo === 'JURIDICA') return 'Pessoa Jurídica'
  if (tipo === 'FISICA') return 'Pessoa Física'
  return 'Estrangeira'
}

function badgeStatus(status: Empresa['statusAprovacao']) {
  if (status === 'APROVADA') return { label: 'Aprovada', className: 'bg-[#0B1020] text-white' }
  if (status === 'REPROVADA') return { label: 'Reprovada', className: 'bg-[#D1162F] text-white' }
  return { label: 'Pendente', className: 'bg-[#F59E0B] text-white' }
}

export function Home() {
  const navigate = useNavigate()
  const [session] = useState(() => getSession())
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [perfis, setPerfis] = useState<EmpresaPerfil[]>([])

  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState<'TODOS' | Empresa['statusAprovacao']>('TODOS')

  useEffect(() => {
    if (!session) {
      navigate('/login')
      return
    }
    let alive = true
    async function load() {
      setErro(null)
      setLoading(true)
      try {
        const [e, p] = await Promise.all([api.empresas.listar(), api.perfis.listar()])
        if (!alive) return
        setEmpresas(e)
        setPerfis(p)
      } catch (e: any) {
        if (!alive) return
        setErro(e?.message || 'Falha ao carregar empresas.')
      } finally {
        if (!alive) return
        setLoading(false)
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [navigate, session])

  const perfisMap = useMemo(() => {
    const map = new Map<number, string>()
    for (const p of perfis) map.set(p.idEmpresaPerfil, p.nome)
    return map
  }, [perfis])

  const empresasFiltradas = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return empresas.filter((e) => {
      if (status !== 'TODOS' && e.statusAprovacao !== status) return false
      if (!q) return true
      const hay = [
        e.nomeFantasia,
        e.razaoSocial,
        e.nomePessoa,
        e.cnpj,
        e.cpf,
        perfisMap.get(e.idEmpresaPerfil),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [busca, empresas, perfisMap, status])

  const stats = useMemo(() => {
    const total = empresas.length
    const pendentes = empresas.filter((e) => e.statusAprovacao === 'PENDENTE').length
    const aprovadas = empresas.filter((e) => e.statusAprovacao === 'APROVADA').length
    return { total, pendentes, aprovadas }
  }, [empresas])

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-[8px] bg-[#1D4ED8] flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
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
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-[14px] font-semibold text-slate-900">
                  Portal ST
                </div>
                <div className="text-[11px] text-slate-500">
                  Cadastro de Empresas
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="rounded-[6px] bg-[#E6F0FF] px-2 py-1 text-[11px] font-medium text-[#1D4ED8]">
                {session?.tipoUsuario === 'INTERNO' ? 'Interno' : 'Externo'}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-[12px] text-slate-700 hover:text-slate-900"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M10 7V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 12H3m0 0 3-3m-3 3 3 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sair
              </button>
            </div>
          </div>

          <div className="h-12 flex items-center gap-6 text-[12px] text-slate-700">
            <NavLink
              to="/inicio"
              className={({ isActive }: { isActive: boolean }) =>
                `inline-flex items-center gap-2 ${
                  isActive ? 'text-slate-900 font-medium' : 'hover:text-slate-900'
                }`
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 13h6v7H4v-7Zm10-9h6v16h-6V4ZM4 4h6v7H4V4Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              Dashboard
            </NavLink>

            <NavLink
              to="/nova-empresa"
              className={({ isActive }: { isActive: boolean }) =>
                `inline-flex items-center gap-2 ${
                  isActive ? 'text-slate-900 font-medium' : 'hover:text-slate-900'
                }`
              }
            >
              <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[6px] bg-slate-100 text-slate-700">
                +
              </span>
              Nova Empresa
            </NavLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[28px] font-semibold text-slate-900">
              Minhas Empresas
            </h1>
            <p className="mt-1 text-[12px] text-slate-500">
              Gerencie as empresas cadastradas
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/nova-empresa')}
            className="mt-2 inline-flex items-center gap-2 rounded-[10px] bg-[#0B1020] px-4 py-2 text-[12px] font-medium text-white shadow-[0_8px_18px_rgba(15,23,42,0.20)] hover:bg-[#0A0E1A] active:bg-[#070B14]"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-[7px] bg-white/10">
              +
            </span>
            Nova Empresa
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <section className="rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
            <div className="px-5 py-4">
              <div className="flex items-start gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="mt-[2px] text-slate-600"
                >
                  <path
                    d="M7 7h10M7 12h10M7 17h7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
                <div>
                  <div className="text-[12px] font-medium text-slate-800">
                    Visão Geral
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Estatísticas do banco (tempo real)
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[10px] bg-slate-50 px-6 py-5">
                <div className="grid grid-cols-3 gap-4">
                  <Stat value={String(stats.total)} label="Total" colorClass="text-[#2563EB]" />
                  <Stat
                    value={String(stats.pendentes)}
                    label="Pendentes"
                    colorClass="text-[#F59E0B]"
                  />
                  <Stat
                    value={String(stats.aprovadas)}
                    label="Aprovadas"
                    colorClass="text-[#22C55E]"
                  />
                </div>

                {erro ? (
                  <div className="mt-4 rounded-[10px] bg-red-50 px-4 py-3 text-[11px] text-red-800 border border-red-100">
                    {erro}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
            <div className="px-5 py-4">
              <div className="text-[12px] font-medium text-slate-800">
                Filtros
              </div>
              <div className="text-[11px] text-slate-500">
                Busque e filtre empresas cadastradas
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="relative">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <path
                      d="M21 21l-4.3-4.3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                  <input
                    className="h-9 w-full rounded-[10px] border border-slate-200 bg-slate-50 pl-9 pr-3 text-[12px] text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100"
                    placeholder="Buscar por nome, CNPJ, CPF..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="h-9 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100"
                >
                  <option value="TODOS">Todos os status</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="APROVADA">Aprovada</option>
                  <option value="REPROVADA">Reprovada</option>
                </select>

                <select className="h-9 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100">
                  <option>Todos os tipos</option>
                </select>
              </div>
            </div>
          </section>

          {loading ? (
            <section className="rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
              <div className="px-5 py-4 text-[12px] text-slate-600">Carregando empresas...</div>
            </section>
          ) : empresasFiltradas.length === 0 ? (
            <section className="rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
              <div className="px-5 py-6 text-center">
                <div className="text-[13px] font-semibold text-slate-900">Nenhuma empresa encontrada</div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Cadastre uma nova empresa ou ajuste os filtros.
                </div>
              </div>
            </section>
          ) : (
            empresasFiltradas.map((e) => {
              const statusBadge = badgeStatus(e.statusAprovacao)
              const titulo = e.razaoSocial || e.nomePessoa || e.nomeFantasia
              const perfilNome = perfisMap.get(e.idEmpresaPerfil) || `Perfil #${e.idEmpresaPerfil}`
              return (
                <section
                  key={e.idEmpresa}
                  className="rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]"
                >
                  <div className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-[13px] font-semibold text-slate-900">{titulo}</div>
                          <span
                            className={`rounded-[6px] px-2 py-0.5 text-[10px] font-medium ${statusBadge.className}`}
                          >
                            {statusBadge.label}
                          </span>
                          <span className="rounded-[6px] bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                            {formatTipoPessoa(e.tipoPessoa)}
                          </span>
                        </div>

                        <div className="mt-2 grid grid-cols-1 gap-1 text-[11px] text-slate-600 md:grid-cols-2">
                          <div>
                            <span className="text-slate-500">Nome Fantasia:</span> {e.nomeFantasia}
                          </div>
                          <div>
                            <span className="text-slate-500">Perfil:</span> {perfilNome}
                          </div>
                          {e.cnpj ? (
                            <div>
                              <span className="text-slate-500">CNPJ:</span> {e.cnpj}
                            </div>
                          ) : null}
                          {e.cpf ? (
                            <div>
                              <span className="text-slate-500">CPF:</span> {e.cpf}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/empresa/${e.idEmpresa}`)}
                        className="inline-flex items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-800 hover:bg-slate-50"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="text-slate-500"
                        >
                          <path
                            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                          <path
                            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                        </svg>
                        Detalhes
                      </button>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
                      Cadastrada em {new Date(e.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </section>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

