import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { API_URL } from '../lib/env'
import type { Empresa, EmpresaDocumento, EmpresaPerfil } from '../lib/types'
import { clearSession, getSession } from '../lib/session'

function Header() {
  const navigate = useNavigate()
  const [session] = useState(() => getSession())

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  return (
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
                <path d="M14 3v5h5" stroke="white" strokeWidth="1.7" />
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
  )
}

function DocumentoItem({
  nome,
  tamanho,
  obrigatorio = true,
  href,
}: {
  nome: string
  tamanho: string
  obrigatorio?: boolean
  href?: string
}) {
  return (
    <div className="rounded-[10px] bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="text-[#2563EB]"
        >
          <path
            d="M8 3h6l4 4v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.7" />
        </svg>

        <div className="min-w-0">
          {href ? (
            <a
              href={href}
              className="truncate text-[12px] font-medium text-slate-900 hover:underline"
            >
              {nome}
            </a>
          ) : (
            <div className="truncate text-[12px] font-medium text-slate-900">{nome}</div>
          )}
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-[11px] text-slate-500">{tamanho}</span>
            {obrigatorio ? (
              <span className="rounded-[6px] bg-[#0B1020] px-2 py-0.5 text-[10px] font-medium text-white">
                Obrigatório
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatBytes(bytes: number) {
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function formatTipoPessoa(tipo: Empresa['tipoPessoa']) {
  if (tipo === 'JURIDICA') return 'Pessoa Jurídica'
  if (tipo === 'FISICA') return 'Pessoa Física'
  return 'Estrangeira'
}

function statusBadge(status: Empresa['statusAprovacao']) {
  if (status === 'APROVADA') return { label: 'Aprovada', className: 'bg-[#0B1020] text-white' }
  if (status === 'REPROVADA') return { label: 'Reprovada', className: 'bg-[#D1162F] text-white' }
  return { label: 'Pendente', className: 'bg-[#F59E0B] text-white' }
}

export function EmpresaDetalhes() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [session] = useState(() => getSession())

  const idEmpresa = Number(id)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [docs, setDocs] = useState<EmpresaDocumento[]>([])
  const [perfis, setPerfis] = useState<EmpresaPerfil[]>([])

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadObrigatorio, setUploadObrigatorio] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)

  useEffect(() => {
    if (!session) {
      navigate('/login')
      return
    }
    if (!idEmpresa || Number.isNaN(idEmpresa)) {
      setErro('ID de empresa inválido.')
      setLoading(false)
      return
    }
    let alive = true
    async function load() {
      setErro(null)
      setLoading(true)
      try {
        const [e, d, p] = await Promise.all([
          api.empresas.buscar(idEmpresa),
          api.empresas.documentos.listar(idEmpresa),
          api.perfis.listar(),
        ])
        if (!alive) return
        setEmpresa(e)
        setDocs(d.filter((x) => x.status === 'ATIVO'))
        setPerfis(p)
      } catch (e: any) {
        if (!alive) return
        setErro(e?.message || 'Falha ao carregar empresa.')
      } finally {
        if (!alive) return
        setLoading(false)
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [idEmpresa, navigate, session])

  const perfilNome = useMemo(() => {
    if (!empresa) return ''
    return perfis.find((p) => p.idEmpresaPerfil === empresa.idEmpresaPerfil)?.nome || ''
  }, [empresa, perfis])

  async function handleUpload() {
    if (!empresa || !uploadFile) return
    setUploadLoading(true)
    try {
      await api.empresas.documentos.upload(empresa.idEmpresa, {
        obrigatorio: uploadObrigatorio,
        descricao: uploadObrigatorio ? 'Documento obrigatório' : 'Documento opcional',
        file: uploadFile,
      })
      const d = await api.empresas.documentos.listar(empresa.idEmpresa)
      setDocs(d.filter((x) => x.status === 'ATIVO'))
      setUploadFile(null)
    } catch (e: any) {
      setErro(e?.message || 'Falha ao enviar documento.')
    } finally {
      setUploadLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="mx-auto max-w-[720px]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[38px] leading-none font-semibold text-slate-900">
                Detalhes da Empresa
              </h1>
              <p className="mt-2 text-[12px] text-slate-500">ID: {id}</p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/inicio')}
              className="rounded-[10px] border border-slate-200 bg-white px-4 py-2 text-[12px] text-slate-800 hover:bg-slate-50"
            >
              Voltar
            </button>
          </div>

          {erro ? (
            <div className="mt-6 rounded-[12px] border border-red-100 bg-red-50 px-6 py-4 text-[12px] text-red-800">
              {erro}
            </div>
          ) : null}

          <section className="mt-6 rounded-[12px] border border-slate-200 bg-white">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-[12px] font-semibold text-slate-900">
                  Informações Gerais
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-[999px] px-2.5 py-1 text-[10px] font-medium ${
                    empresa ? statusBadge(empresa.statusAprovacao).className : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
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
                  {empresa ? statusBadge(empresa.statusAprovacao).label : '...'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 text-[12px] sm:grid-cols-2">
                <div>
                  <div className="text-slate-400">Tipo</div>
                  <div className="font-medium text-slate-800">
                    {empresa ? formatTipoPessoa(empresa.tipoPessoa) : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Razão Social</div>
                  <div className="font-medium text-slate-800">
                    {empresa?.razaoSocial || empresa?.razaoSocialEstrangeira || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Nome Fantasia</div>
                  <div className="font-medium text-slate-800">{empresa?.nomeFantasia || '-'}</div>
                </div>
                <div>
                  <div className="text-slate-400">CNPJ</div>
                  <div className="font-medium text-slate-800">{empresa?.cnpj || '-'}</div>
                </div>
                <div>
                  <div className="text-slate-400">Perfil</div>
                  <div className="font-medium text-slate-800">{perfilNome || '-'}</div>
                </div>
                <div>
                  <div className="text-slate-400">Faturamento Direto</div>
                  <div className="font-medium text-slate-800">
                    {empresa ? (empresa.faturamentoDireto ? 'Sim' : 'Não') : '-'}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 text-[12px] sm:grid-cols-2">
                <div>
                  <div className="text-slate-400">Criada em</div>
                  <div className="font-medium text-slate-800">
                    {empresa ? new Date(empresa.createdAt).toLocaleString('pt-BR') : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Aprovada em</div>
                  <div className="font-medium text-slate-800">
                    {empresa?.aprovadoEm ? new Date(empresa.aprovadoEm).toLocaleString('pt-BR') : '-'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-[12px] border border-slate-200 bg-white">
            <div className="px-6 py-5">
              <div className="text-[12px] font-semibold text-slate-900">Documentos</div>
              <div className="mt-1 text-[11px] text-slate-500">
                Arquivos anexados à empresa
              </div>

              <div className="mt-4 rounded-[12px] border border-slate-200 bg-white px-4 py-4">
                <div className="text-[12px] font-semibold text-slate-900">Enviar novo documento</div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    accept="application/pdf,image/png,image/jpeg"
                    onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                    className="text-[12px]"
                  />
                  <label className="flex items-center gap-2 text-[12px] text-slate-800">
                    <input
                      type="checkbox"
                      checked={uploadObrigatorio}
                      onChange={(e) => setUploadObrigatorio(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-slate-900"
                    />
                    Obrigatório
                  </label>
                  <button
                    type="button"
                    disabled={!uploadFile || uploadLoading}
                    onClick={handleUpload}
                    className="inline-flex items-center justify-center rounded-[10px] bg-[#0B1020] px-4 py-2 text-[12px] font-medium text-white disabled:opacity-50"
                  >
                    {uploadLoading ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {loading ? (
                  <div className="text-[12px] text-slate-600">Carregando documentos...</div>
                ) : docs.length === 0 ? (
                  <div className="text-[12px] text-slate-600">Nenhum documento anexado.</div>
                ) : (
                  docs.map((d) => (
                    <DocumentoItem
                      key={d.idEmpresaDocumento}
                      nome={d.nomeArquivoOriginal}
                      tamanho={formatBytes(d.tamanhoBytes)}
                      obrigatorio={d.obrigatorio}
                      href={`${API_URL}/empresas/${d.idEmpresa}/documentos/${d.idEmpresaDocumento}/download`}
                    />
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

