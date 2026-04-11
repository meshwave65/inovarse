import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Loader2, RefreshCw, Sparkles, AlertCircle } from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

interface LeadData {
  nome: string
  telefone: string
  email: string
}

interface ResultData {
  // Valores calculados (combinação de sliders + preferências pareadas)
  altMind: string
  altBody: string
  altPurpose: string
  // Deslocamentos laterais (preferências pessoais)
  deslocMind: string
  deslocBody: string
  deslocPurpose: string
  // Valores ideais (preferências primárias)
  prefMind: number
  prefBody: number
  prefPurpose: number
  // Preferências pareadas
  pairedMB: { mind: number; body: number }
  pairedBP: { body: number; purpose: number }
  pairedMP: { mind: number; purpose: number }
}

interface Point {
  x: number
  y: number
}

const calculateIsoscelesPoint = (
  value: number,
  balanceA: number,
  balanceB: number,
  vBase1: Point,
  vBase2: Point,
  vTip: Point
): Point => {
  const t = value / 10
  const midBase: Point = {
    x: (vBase1.x + vBase2.x) / 2,
    y: (vBase1.y + vBase2.y) / 2,
  }
  const pHeight: Point = {
    x: midBase.x + t * (vTip.x - midBase.x),
    y: midBase.y + t * (vTip.y - midBase.y),
  }
  const widthVector = {
    x: (vBase2.x - vBase1.x) * (1 - t),
    y: (vBase2.y - vBase1.y) * (1 - t),
  }
  const balanceFactor = (balanceB - balanceA) / 10
  return {
    x: pHeight.x + (balanceFactor * widthVector.x) / 2,
    y: pHeight.y + (balanceFactor * widthVector.y) / 2,
  }
}

export default function Teste() {
  const [leads, setLead] = useState<LeadData>({
    nome: "",
    telefone: "",
    email: "",
  })
  const [showIntro, setShowIntro] = useState(true)
  const [showSliders, setShowSliders] = useState(false)

  // Sliders principais: Mind e Body (Purpose é calculado)
  const [mind, setMind] = useState(4)
  const [body, setBody] = useState(3)
  const restante = Math.max(0, 10 - mind)
  const purpose = Math.max(0, restante - body)

  // Preferências pareadas (balanços secundários)
  const [pairedMB, setPairedMB] = useState({ mind: 5, body: 5 })
  const [pairedBP, setPairedBP] = useState({ body: 5, purpose: 5 })
  const [pairedMP, setPairedMP] = useState({ mind: 5, purpose: 5 })

  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(false)

  const submitLeadMutation = trpc.mce.submitLead.useMutation()
  const submitResultMutation = trpc.mce.submitResult.useMutation()

  const irParaSliders = () => {
    if (!leads.nome || !leads.email || !leads.telefone) {
      toast.error("Por favor, preencha todos os campos para continuar.")
      return
    }
    setShowIntro(false)
    setShowSliders(true)
  }

  const calcular = async () => {
    setLoading(true)

    // Cálculo das alturas combinadas (slider + influência das preferências pareadas)
    const altMind = ((mind + pairedMB.mind * 0.5 + pairedMP.mind * 0.5) / 2).toFixed(1)
    const altBody = ((body + pairedMB.body * 0.5 + pairedBP.body * 0.5) / 2).toFixed(1)
    const altPurpose = ((purpose + pairedBP.purpose * 0.5 + pairedMP.purpose * 0.5) / 2).toFixed(1)

    // Deslocamentos laterais (expressões autênticas de preferência pessoal)
    const deslocMind = ((pairedMB.mind - pairedMB.body) + (pairedMP.mind - pairedMP.purpose)) / 2
    const deslocBody = ((pairedMB.body - pairedMB.mind) + (pairedBP.body - pairedBP.purpose)) / 2
    const deslocPurpose = ((pairedBP.purpose - pairedBP.body) + (pairedMP.purpose - pairedMP.mind)) / 2

    const res: ResultData = {
      altMind,
      altBody,
      altPurpose,
      deslocMind: deslocMind.toFixed(1),
      deslocBody: deslocBody.toFixed(1),
      deslocPurpose: deslocPurpose.toFixed(1),
      prefMind: mind,
      prefBody: body,
      prefPurpose: purpose,
      pairedMB,
      pairedBP,
      pairedMP,
    }

    try {
      // Salvar lead e resultado via tRPC
      const leadResult = await submitLeadMutation.mutateAsync({
        nome: leads.nome.trim(),
        telefone: leads.telefone.trim(),
        email: leads.email.trim(),
      })

      if (leadResult.success && leadResult.leadId) {
        await submitResultMutation.mutateAsync({
          leadId: leadResult.leadId,
          mind: parseFloat(altMind),
          body: parseFloat(altBody),
          purpose: parseFloat(altPurpose),
          prefMind: mind,
          prefBody: body,
          prefPurpose: purpose,
        })
        toast.success("Seu perfil foi salvo com sucesso!")
      } else {
        toast.error("Erro ao registrar seus dados no banco.")
      }
    } catch (err: any) {
      console.error("Erro ao salvar resultado:", err)
      toast.error("Erro de conexão com o servidor. Verifique se as tabelas existem no Supabase.")
    } finally {
      setResult(res)
      localStorage.setItem("mbpTriangle_result", JSON.stringify(res))
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setLead({ nome: "", telefone: "", email: "" })
    setShowIntro(true)
    setShowSliders(false)
    localStorage.removeItem("mbpTriangle_result")
  }

  const getInterpretation = (res: ResultData) => {
    const m = Number(res.altMind)
    const b = Number(res.altBody)
    const p = Number(res.altPurpose)

    const diffM = Math.abs(m - res.prefMind)
    const diffB = Math.abs(b - res.prefBody)
    const diffP = Math.abs(p - res.prefPurpose)
    const maiorDiff = Math.max(diffM, diffB, diffP)

    if (maiorDiff <= 1.2 && m > 3 && b > 3 && p > 3) {
      return (
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Perfil: Harmonia Integrativa
          </p>
          <p>
            Seu MBP Triangle revela uma distribuição equilibrada entre as três dimensões. Você consegue
            transitar entre as demandas mentais, as necessidades físicas e a conexão com seu propósito
            com fluidez natural.
          </p>
        </div>
      )
    }

    if (diffM === maiorDiff) {
      return (
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Perfil: Mind-Centric
          </p>
          <p>
            Seu padrão MBP mostra uma preferência natural pela dimensão <strong>Mind</strong>. Você
            tende a priorizar processos cognitivos e a integrar Body e Purpose através de uma lente
            mental.
          </p>
        </div>
      )
    }

    if (diffB === maiorDiff) {
      return (
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Perfil: Body-Centric
          </p>
          <p>
            Seu padrão MBP mostra uma preferência natural pela dimensão <strong>Body</strong>. Você
            tende a priorizar a manutenção fisiológica e a integrar Mind e Purpose através de uma
            lente corporal e sensorial.
          </p>
        </div>
      )
    }

    if (diffP === maiorDiff) {
      return (
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-700">
            Perfil: Purpose-Centric
          </p>
          <p>
            Seu padrão MBP mostra uma preferência natural pela dimensão <strong>Purpose</strong>. Você
            tende a priorizar processos orientados a propósito e a integrar Mind e Body através de uma
            lente de significado e valores.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-3 text-[15px] leading-relaxed">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">
          Perfil: Transição e Integração
        </p>
        <p>
          Seu MBP Triangle indica um momento de transição interessante. As três dimensões estão
          em processo de reequilíbrio.
        </p>
      </div>
    )
  }

  const inputClass =
    "w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"

  const primaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_18px_40px_-18px_rgba(13,148,136,0.7)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-20px_rgba(13,148,136,0.82)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"

  // ─── Tela de Introdução ───────────────────────────────────────────────────
  if (showIntro) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.10),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.10),transparent_25%)]" />

        <div className="relative flex min-h-screen items-center justify-center px-4 py-10 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <div className="rounded-[2rem] border border-white/70 bg-white/82 p-8 shadow-[0_28px_90px_-38px_rgba(15,23,42,0.38)] backdrop-blur-2xl md:p-12">
              <div className="mb-2 flex items-center gap-2">
                <img src="/logo_inovarse.jpeg" alt="Inovarse" className="w-8 h-8 rounded-full" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  Inovarse
                </span>
              </div>

              <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] text-slate-900 md:text-5xl">
                Teste MBP Triangle
              </h1>
              <p className="mt-2 text-base text-slate-600 md:text-lg">
                Mind · Body · Purpose
              </p>

              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
                <p className="text-sm font-semibold text-emerald-800 mb-2">O que é o MBP Triangle?</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  O <strong>MBP Triangle</strong> é um modelo geométrico que representa como você
                  naturalmente distribui seus recursos existenciais entre três dimensões fundamentais.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-sm font-semibold text-slate-700">Seus dados (obrigatório)</p>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={leads.nome}
                  onChange={(e) => setLead((l) => ({ ...l, nome: e.target.value }))}
                  className={inputClass}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp (com DDD)"
                  value={leads.telefone}
                  onChange={(e) => setLead((l) => ({ ...l, telefone: e.target.value }))}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={leads.email}
                  onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={irParaSliders}
                className={`${primaryButtonClass} mt-8 w-full py-4 text-base`}
              >
                Iniciar Mapeamento
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ─── Tela dos Sliders ─────────────────────────────────────────────────────
  if (showSliders && !result) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-gradient-to-b from-white/68 via-white/72 to-white/90" />

        <div className="relative flex min-h-screen items-center justify-center px-4 py-10 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="w-full max-w-2xl space-y-8"
          >
            <section className="rounded-[2rem] border border-white/70 bg-white/82 p-8 shadow-[0_28px_90px_-38px_rgba(15,23,42,0.38)] backdrop-blur-2xl">
              <h2 className="mb-2 text-center font-display text-2xl tracking-[-0.03em] text-slate-800 md:text-3xl">
                1. Suas Preferências
              </h2>
              <p className="mb-6 text-center text-sm text-slate-500">
                Como você prefere distribuir sua energia? (Total: 10)
              </p>

              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-soft">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Mind</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-700">{mind}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={mind}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setMind(v)
                      if (v + body > 10) setBody(Math.max(0, 10 - v))
                    }}
                    className="w-full cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-soft">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Body</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-700">{body}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, 10 - mind)}
                    step={0.5}
                    value={body}
                    onChange={(e) => setBody(Number(e.target.value))}
                    className="w-full cursor-pointer accent-emerald-600"
                  />
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-soft opacity-80">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">Purpose</span>
                    </div>
                    <span className="text-2xl font-bold text-violet-700">{purpose}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-violet-400 transition-all"
                      style={{ width: `${(purpose / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-white/82 p-8 shadow-[0_28px_90px_-38px_rgba(15,23,42,0.38)] backdrop-blur-2xl">
              <h2 className="mb-2 text-center font-display text-2xl tracking-[-0.03em] text-slate-800 md:text-3xl">
                2. Preferências Relativas
              </h2>
              <p className="mb-6 text-center text-sm text-slate-500">
                Quando precisa escolher entre dois aspectos, qual você prefere?
              </p>

              <div className="space-y-5">
                <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-soft">
                  <div className="mb-4 flex items-center justify-between text-sm font-semibold uppercase tracking-[0.18em]">
                    <span className="text-blue-700">Mind</span>
                    <span className="text-emerald-700">Body</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={pairedMB.mind}
                    onChange={(e) =>
                      setPairedMB({
                        mind: Number(e.target.value),
                        body: 10 - Number(e.target.value),
                      })
                    }
                    className="w-full cursor-pointer accent-emerald-600"
                  />
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-soft">
                  <div className="mb-4 flex items-center justify-between text-sm font-semibold uppercase tracking-[0.18em]">
                    <span className="text-emerald-700">Body</span>
                    <span className="text-violet-700">Purpose</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={pairedBP.body}
                    onChange={(e) =>
                      setPairedBP({
                        body: Number(e.target.value),
                        purpose: 10 - Number(e.target.value),
                      })
                    }
                    className="w-full cursor-pointer accent-violet-600"
                  />
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-soft">
                  <div className="mb-4 flex items-center justify-between text-sm font-semibold uppercase tracking-[0.18em]">
                    <span className="text-blue-700">Mind</span>
                    <span className="text-violet-700">Purpose</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={pairedMP.mind}
                    onChange={(e) =>
                      setPairedMP({
                        mind: Number(e.target.value),
                        purpose: 10 - Number(e.target.value),
                      })
                    }
                    className="w-full cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </section>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={calcular}
              disabled={loading}
              className={`${primaryButtonClass} w-full py-3.5 text-[15px] md:text-base`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculando seu MBP Triangle...
                </>
              ) : (
                <>
                  Ver Meu MBP Triangle
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ─── Tela de Resultado ────────────────────────────────────────────────────
  if (result) {
    const whatsappMessage = encodeURIComponent(
      `Olá! Vim do site Inovarse e fiz o Teste MBP Triangle.\n\n` +
        `📊 Meu perfil MBP Triangle:\n` +
        `• Mind (Mente): ${result.altMind}\n` +
        `• Body (Corpo): ${result.altBody}\n` +
        `• Purpose (Propósito): ${result.altPurpose}\n\n` +
        `Gostaria de agendar uma avaliação.`
    )

    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(168,85,247,0.08),transparent_28%),radial-gradient(circle_at_50%_85%,rgba(59,130,246,0.08),transparent_24%)]" />

        <div className="relative flex min-h-screen items-center justify-center px-4 py-8 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="w-full max-w-5xl"
          >
            <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-[0_28px_90px_-38px_rgba(15,23,42,0.38)] backdrop-blur-2xl md:p-10">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700">
                    Resultado
                  </p>
                  <h1 className="mt-2 font-display text-4xl tracking-[-0.04em] text-slate-900 md:text-5xl">
                    Seu MBP Triangle
                  </h1>
                </div>

                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-900"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Fazer novo teste
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="mb-8 flex justify-center"
              >
                <TriangleVisualization data={result} />
              </motion.div>

              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  { label: "Mind", value: result.altMind, icon: "🧠", color: "from-blue-600 to-cyan-600" },
                  { label: "Body", value: result.altBody, icon: "💪", color: "from-emerald-600 to-teal-600" },
                  { label: "Purpose", value: result.altPurpose, icon: "✨", color: "from-violet-600 to-fuchsia-600" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-[1.75rem] bg-gradient-to-br ${item.color} p-5 text-white shadow-[0_20px_50px_-26px_rgba(15,23,42,0.45)]`}
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] opacity-85">
                      {item.label}
                    </p>
                    <p className="mt-1 text-4xl font-semibold tracking-[-0.05em]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mb-8 rounded-[1.75rem] border border-emerald-200/70 bg-gradient-to-r from-emerald-50 to-white p-6 shadow-soft md:p-8">
                <div className="text-slate-800">{getInterpretation(result)}</div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 text-center shadow-soft">
                <a
                  href={`https://wa.me/351914845439?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-18px_rgba(22,163,74,0.72)] transition hover:-translate-y-0.5 hover:bg-green-700"
                >
                  📱 Falar no WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return null
}

const TriangleVisualization = ({ data }: { data: ResultData }) => {
  const size = 380
  const centerX = size / 2
  const centerY = size / 2 + 10
  const radius = 152

  const L: Point = { x: centerX - (radius * Math.sqrt(3)) / 2, y: centerY + radius / 2 }
  const R: Point = { x: centerX + (radius * Math.sqrt(3)) / 2, y: centerY + radius / 2 }
  const T: Point = { x: centerX, y: centerY - radius }
  const Center: Point = { x: centerX, y: centerY }

  const pM = calculateIsoscelesPoint(
    data.prefMind,
    data.pairedMB.body,
    data.pairedMP.purpose,
    L,
    R,
    Center
  )

  const pB = calculateIsoscelesPoint(
    data.prefBody,
    data.pairedMB.mind,
    data.pairedBP.purpose,
    L,
    T,
    Center
  )

  const pP = calculateIsoscelesPoint(
    data.prefPurpose,
    data.pairedMP.mind,
    data.pairedBP.body,
    R,
    T,
    Center
  )

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-4 shadow-[0_26px_80px_-34px_rgba(15,23,42,0.4)] backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.10),transparent_26%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.10),transparent_24%)]" />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative drop-shadow-sm"
      >
        <polygon
          points={`${L.x},${L.y} ${R.x},${R.y} ${Center.x},${Center.y}`}
          fill="#3b82f6"
          fillOpacity="0.08"
        />
        <polygon
          points={`${L.x},${L.y} ${T.x},${T.y} ${Center.x},${Center.y}`}
          fill="#10b981"
          fillOpacity="0.08"
        />
        <polygon
          points={`${R.x},${R.y} ${T.x},${T.y} ${Center.x},${Center.y}`}
          fill="#8b5cf6"
          fillOpacity="0.08"
        />

        <polygon
          points={`${L.x},${L.y} ${R.x},${R.y} ${T.x},${T.y}`}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        <line x1={L.x} y1={L.y} x2={Center.x} y2={Center.y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
        <line x1={R.x} y1={R.y} x2={Center.x} y2={Center.y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
        <line x1={T.x} y1={T.y} x2={Center.x} y2={Center.y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />

        <polygon
          points={`${pM.x},${pM.y} ${pB.x},${pB.y} ${pP.x},${pP.y}`}
          fill="rgba(79, 70, 229, 0.20)"
          stroke="#4f46e5"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        <circle cx={Center.x} cy={Center.y} r="4" fill="#94a3b8" opacity="0.5" />

        <circle cx={pM.x} cy={pM.y} r="6" fill="#3b82f6" stroke="white" strokeWidth="2.5" />
        <circle cx={pB.x} cy={pB.y} r="6" fill="#10b981" stroke="white" strokeWidth="2.5" />
        <circle cx={pP.x} cy={pP.y} r="6" fill="#8b5cf6" stroke="white" strokeWidth="2.5" />

        <text
          x={size / 2}
          y={L.y + 28}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#1d4ed8"
        >
          MIND
        </text>
        <text
          x={L.x - 18}
          y={L.y - (L.y - T.y) / 2}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#047857"
          transform={`rotate(-60, ${L.x - 18}, ${L.y - (L.y - T.y) / 2})`}
        >
          BODY
        </text>
        <text
          x={R.x + 18}
          y={R.y - (R.y - T.y) / 2}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#6d28d9"
          transform={`rotate(60, ${R.x + 18}, ${R.y - (R.y - T.y) / 2})`}
        >
          PURPOSE
        </text>
      </svg>
    </motion.div>
  )
}
