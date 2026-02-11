import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useId, useMemo, useState } from 'react'
import { api } from '../lib/api'
import type { EmpresaPerfil } from '../lib/types'
import { clearSession, getSession } from '../lib/session'

type TipoEmpresa = 'pj' | 'pf' | 'estrangeira'

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
  )
}

function UploadBox({
  title,
  required,
  onChange,
  fileName,
}: {
  title: string
  required?: boolean
  onChange: (file: File | null) => void
  fileName?: string | null
}) {
  const inputId = useId()

  return (
    <div>
      <div className="text-[11px] font-medium text-slate-800">
        {title}
        {required ? <span className="text-red-600"> *</span> : null}
      </div>
      <label
        htmlFor={inputId}
        className="mt-2 flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-slate-200 bg-white text-center hover:bg-slate-50"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="text-slate-500"
        >
          <path
            d="M12 16V4m0 0 4 4m-4-4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <div className="mt-2 text-[12px] font-medium text-slate-800">
          Clique para selecionar arquivos
        </div>
        <div className="text-[11px] text-slate-500">ou arraste e solte aqui</div>
      </label>
      <input
        id={inputId}
        type="file"
        className="hidden"
        accept="application/pdf,image/png,image/jpeg"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {fileName ? (
        <div className="mt-2 text-[11px] text-slate-600 truncate">{fileName}</div>
      ) : null}
    </div>
  )
}

export function NovaEmpresa() {
  const navigate = useNavigate()
  const [session] = useState(() => getSession())
  const [tipo, setTipo] = useState<TipoEmpresa>('pj')
  const [perfis, setPerfis] = useState<EmpresaPerfil[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [razaoSocial, setRazaoSocial] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [nomePessoa, setNomePessoa] = useState('')
  const [cpf, setCpf] = useState('')
  const [razaoSocialEstrangeira, setRazaoSocialEstrangeira] = useState('')
  const [identificadorEstrangeiro, setIdentificadorEstrangeiro] = useState('')

  const [nomeFantasia, setNomeFantasia] = useState('')
  const [idPerfil, setIdPerfil] = useState<number | ''>('')
  const [faturamentoDireto, setFaturamentoDireto] = useState(false)

  const [docObrigatorio, setDocObrigatorio] = useState<File | null>(null)
  const [docOpcional, setDocOpcional] = useState<File | null>(null)

  useEffect(() => {
    if (!session) {
      navigate('/login')
      return
    }
    let alive = true
    api.perfis
      .listar()
      .then((p) => {
        if (!alive) return
        setPerfis(p)
      })
      .catch((e: any) => {
        if (!alive) return
        setErro(e?.message || 'Falha ao carregar perfis.')
      })
    return () => {
      alive = false
    }
  }, [navigate, session])

  const tipoPessoa = useMemo(() => {
    if (tipo === 'pj') return 'JURIDICA'
    if (tipo === 'pf') return 'FISICA'
    return 'ESTRANGEIRA'
  }, [tipo])

  async function handleSubmit() {
    if (!session) {
      navigate('/login')
      return
    }
    setErro(null)
    setLoading(true)
    try {
      if (!idPerfil) throw new Error('Selecione um perfil.')
      const payload: any = {
        tipo_pessoa: tipoPessoa,
        nome_fantasia: nomeFantasia.trim() || (tipoPessoa === 'FISICA' ? nomePessoa.trim() : razaoSocial.trim()),
        id_empresa_perfil: Number(idPerfil),
        faturamento_direto: faturamentoDireto,
        criado_por_usuario_id: session.idUsuario,
      }

      if (tipoPessoa === 'JURIDICA') {
        payload.razao_social = razaoSocial.trim()
        payload.cnpj = cnpj.trim()
      } else if (tipoPessoa === 'FISICA') {
        payload.nome_pessoa = nomePessoa.trim()
        payload.cpf = cpf.trim()
      } else {
        payload.razao_social_estrangeira = razaoSocialEstrangeira.trim() || undefined
        payload.razao_social = razaoSocial.trim() || undefined
        payload.identificador_estrangeiro = identificadorEstrangeiro.trim()
      }

      const empresa = await api.empresas.criar(payload)

      // upload de documentos (se selecionados)
      if (docObrigatorio) {
        await api.empresas.documentos.upload(empresa.idEmpresa, {
          obrigatorio: true,
          descricao: 'Documento obrigatório',
          file: docObrigatorio,
        })
      }
      if (docOpcional) {
        await api.empresas.documentos.upload(empresa.idEmpresa, {
          obrigatorio: false,
          descricao: 'Documento opcional',
          file: docOpcional,
        })
      }

      navigate(`/empresa/${empresa.idEmpresa}`)
    } catch (e: any) {
      setErro(e?.message || 'Falha ao cadastrar empresa.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="mx-auto max-w-[720px]">
          <div className="text-center">
            <h1 className="text-[22px] font-semibold text-slate-900">
              Cadastrar Nova Empresa
            </h1>
            <p className="mt-1 text-[12px] text-slate-500">
              Preencha os dados da empresa conforme o tipo selecionado
            </p>
          </div>

          <section className="mt-6 rounded-[12px] border border-slate-200 bg-white">
            <div className="px-6 py-5">
              <div className="text-[12px] font-semibold text-slate-900">
                Tipo de Empresa
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Selecione o tipo e preencha os campos correspondentes
              </div>

              <div className="mt-4 rounded-full bg-slate-100 p-1">
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setTipo('pj')}
                    className={`h-8 rounded-full text-[11px] font-medium ${
                      tipo === 'pj'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Pessoa Jurídica
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipo('pf')}
                    className={`h-8 rounded-full text-[11px] font-medium ${
                      tipo === 'pf'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Pessoa Física
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipo('estrangeira')}
                    className={`h-8 rounded-full text-[11px] font-medium ${
                      tipo === 'estrangeira'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Estrangeira
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {/* Pessoa Jurídica: Razão Social + CNPJ */}
                {tipo === 'pj' && (
                  <>
                    <div>
                      <label className="text-[11px] font-medium text-slate-800">
                        Razão Social <span className="text-red-600">*</span>
                      </label>
                      <input
                        className="mt-2 h-9 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100"
                        placeholder="Ex: Empresa LTDA"
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-800">
                        CNPJ (14 dígitos) <span className="text-red-600">*</span>
                      </label>
                      <input
                        className="mt-2 h-9 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100"
                        placeholder="12345678901234"
                        inputMode="numeric"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Pessoa Física: Nome Completo + CPF */}
                {tipo === 'pf' && (
                  <>
                    <div>
                      <label className="text-[11px] font-medium text-slate-800">
                        Nome Completo <span className="text-red-600">*</span>
                      </label>
                      <input
                        className="mt-2 h-9 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100"
                        placeholder="Ex: João da Silva"
                        value={nomePessoa}
                        onChange={(e) => setNomePessoa(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-800">
                        CPF (11 dígitos) <span className="text-red-600">*</span>
                      </label>
                      <input
                        className="mt-2 h-9 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100"
                        placeholder="12345678901"
                        inputMode="numeric"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Estrangeira: Razão Social + Identificador Estrangeiro */}
                {tipo === 'estrangeira' && (
                  <>
                    <div>
                      <label className="text-[11px] font-medium text-slate-800">
                        Razão Social <span className="text-red-600">*</span>
                      </label>
                      <input
                        className="mt-2 h-9 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100"
                        placeholder="Ex: Foreign Company Inc"
                        value={razaoSocialEstrangeira || razaoSocial}
                        onChange={(e) => setRazaoSocialEstrangeira(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-800">
                        Identificador Estrangeiro <span className="text-red-600">*</span>
                      </label>
                      <input
                        className="mt-2 h-9 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100"
                        placeholder="Ex: EIN, VAT, etc"
                        value={identificadorEstrangeiro}
                        onChange={(e) => setIdentificadorEstrangeiro(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="border-t border-slate-200 pt-4">
                  <div className="text-[12px] font-semibold text-slate-900">
                    Dados Adicionais
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-[11px] font-medium text-slate-800">
                        Nome Fantasia
                      </label>
                      <input
                        className="mt-2 h-9 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100"
                        placeholder="Nome comercial da empresa"
                        value={nomeFantasia}
                        onChange={(e) => setNomeFantasia(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-800">
                        Perfil <span className="text-red-600">*</span>
                      </label>
                      <div className="relative mt-2">
                        <select
                          value={idPerfil}
                          onChange={(e) => setIdPerfil(e.target.value ? Number(e.target.value) : '')}
                          className="h-9 w-full appearance-none rounded-[10px] border border-slate-200 bg-slate-50 px-3 pr-10 text-[12px] text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100"
                        >
                          <option value="">Selecione o perfil</option>
                          {perfis.map((p) => (
                            <option key={p.idEmpresaPerfil} value={p.idEmpresaPerfil}>
                              {p.nome}
                            </option>
                          ))}
                        </select>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-[12px] text-slate-800">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 accent-slate-900"
                        checked={faturamentoDireto}
                        onChange={(e) => setFaturamentoDireto(e.target.checked)}
                      />
                      Faturamento Direto
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[12px] border border-slate-200 bg-white">
            <div className="px-6 py-5">
              <div className="text-[12px] font-semibold text-slate-900">
                Documentos
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Formatos aceitos: PDF, PNG, JPG. Tamanho máximo conforme o backend.
              </div>

              <div className="mt-4 space-y-5">
                <UploadBox
                  title="Documento Obrigatório"
                  required
                  onChange={setDocObrigatorio}
                  fileName={docObrigatorio?.name ?? null}
                />
                <UploadBox
                  title="Documento Opcional"
                  onChange={setDocOpcional}
                  fileName={docOpcional?.name ?? null}
                />
              </div>
            </div>
          </section>

          {erro ? (
            <div className="mt-6 rounded-[12px] border border-red-100 bg-red-50 px-5 py-4 text-[12px] text-red-800">
              {erro}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/inicio')}
              className="h-9 rounded-[10px] border border-slate-200 bg-white px-4 text-[12px] text-slate-800 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-[#0B1020] px-4 text-[12px] font-medium text-white shadow-[0_8px_18px_rgba(15,23,42,0.20)] hover:bg-[#0A0E1A] active:bg-[#070B14]"
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
              {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

