import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Loader2, RefreshCw, Sparkles, AlertCircle, Info } from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

interface LeadData {
  nome: string
  telefone: string
  email: string
}

interface ResultData {
  altMind: string
  altBody: string
  altPurpose: string
  deslocMind: string
  deslocBody: string
  deslocPurpose: string
  prefMind: number
  prefBody: number
  prefPurpose: number
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

  const [mind, setMind] = useState(4)
  const [body, setBody] = useState(3)
  const restante = Math.max(0, 10 - mind)
  const purpose = Math.max(0, restante - body)

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

    const altMind = ((mind + pairedMB.mind * 0.5 + pairedMP.mind * 0.5) / 2).toFixed(1)
    const altBody = ((body + pairedMB.body * 0.5 + pairedBP.body * 0.5) / 2).toFixed(1)
    const altPurpose = ((purpose + pairedBP.purpose * 0.5 + pairedMP.purpose * 0.5) / 2).toFixed(1)

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
      const leadResult = await submitLeadMutation.mutateAsync({
        nome: leads.nome.trim(),
        telefone: leads.telefone.trim(),
        email: leads.email.trim(),
      })

      if (leadResult.success && leadResult.leadId) {
        const resultSave = await submitResultMutation.mutateAsync({
          leadId: leadResult.leadId,
          mind: parseFloat(altMind),
          body: parseFloat(altBody),
          purpose: parseFloat(altPurpose),
          prefMind: mind,
          prefBody: body,
          prefPurpose: purpose,
        })
        
        if (resultSave.success) {
          toast.success("Seu perfil foi salvo com sucesso!")
        }
      }
    } catch (err: any) {
      console.error("Erro na submissão:", err)
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
                <p className="text-sm text-emerald-700 leading-relaxed">
                  O MBP Triangle é uma ferramenta de autoavaliação que mapeia suas preferências e comportamentos
                  através de três dimensões fundamentais: <strong>Mind</strong> (Mente/Cognição),
                  <strong> Body</strong> (Corpo/Fisiologia) e <strong>Purpose</strong> (Propósito/Valores).
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

  if (showSliders && !result) {
    return (
      <div className="relative min-h-screen bg-slate-50 overflow-x-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.08),transparent_35%)]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* PAINEL DE CONTROLE - LADO ESQUERDO */}
            <div className="w-full lg:w-7/12 space-y-6">
              
              {/* SEÇÃO 1: PREFERÊNCIAS BÁSICAS */}
              <motion.section 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 leading-none">1. Suas Preferências</h2>
                    <p className="text-xs text-slate-500 mt-1">Distribua sua energia (Total: 10)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Mind Slider */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Mind</span>
                      <span className="text-lg font-black text-blue-700">{mind}</span>
                    </div>
                    <input
                      type="range" min={0} max={10} step={0.5} value={mind}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        setMind(v)
                        if (v + body > 10) setBody(Math.max(0, 10 - v))
                      }}
                      className="w-full h-1.5 bg-blue-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Body Slider */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Body</span>
                      <span className="text-lg font-black text-emerald-700">{body}</span>
                    </div>
                    <input
                      type="range" min={0} max={Math.max(0, 10 - mind)} step={0.5} value={body}
                      onChange={(e) => setBody(Number(e.target.value))}
                      className="w-full h-1.5 bg-emerald-200 rounded-full appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  {/* Purpose Display */}
                  <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">Purpose</span>
                      <span className="text-lg font-black text-violet-700">{purpose}</span>
                    </div>
                    <div className="w-full h-1.5 bg-violet-200 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-violet-500"
                        animate={{ width: `${(purpose / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* SEÇÃO 2: PREFERÊNCIAS RELATIVAS (PARES) */}
              <motion.section 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 leading-none">2. Preferências Relativas</h2>
                    <p className="text-xs text-slate-500 mt-1">Mova o slider em direção ao que considera mais relevante</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Pair: Mind vs Body */}
                  <PairControl 
                    labelL="Mind" labelR="Body" 
                    valL={pairedMB.mind} valR={pairedMB.body}
                    colorL="#2563eb" colorR="#10b981"
                    onChange={(v) => setPairedMB({ mind: v, body: 10 - v })}
                  />

                  {/* Pair: Body vs Purpose */}
                  <PairControl 
                    labelL="Body" labelR="Purpose" 
                    valL={pairedBP.body} valR={pairedBP.purpose}
                    colorL="#10b981" colorR="#8b5cf6"
                    onChange={(v) => setPairedBP({ body: v, purpose: 10 - v })}
                  />

                  {/* Pair: Mind vs Purpose */}
                  <PairControl 
                    labelL="Mind" labelR="Purpose" 
                    valL={pairedMP.mind} valR={pairedMP.purpose}
                    colorL="#2563eb" colorR="#8b5cf6"
                    onChange={(v) => setPairedMP({ mind: v, purpose: 10 - v })}
                  />
                </div>
              </motion.section>

              {/* BOTÃO DE CÁLCULO */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={calcular}
                disabled={loading}
                className={`${primaryButtonClass} w-full py-4 text-base shadow-2xl`}
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Calculando...</>
                ) : (
                  <><Sparkles className="h-5 w-5" /> Ver Meu MBP Triangle</>
                )}
              </motion.button>
            </div>

            {/* VISUALIZAÇÃO DO TRIÂNGULO - LADO DIREITO (FIXO/STRECH) */}
            <div className="w-full lg:w-5/12 lg:sticky lg:top-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-white/70 bg-white/40 p-6 shadow-2xl backdrop-blur-md flex flex-col items-center"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Visualização em Tempo Real</p>
                <TriangleVisualization data={{
                  altMind: mind.toString(),
                  altBody: body.toString(),
                  altPurpose: purpose.toString(),
                  deslocMind: "0", deslocBody: "0", deslocPurpose: "0",
                  prefMind: mind, prefBody: body, prefPurpose: purpose,
                  pairedMB, pairedBP, pairedMP,
                }} />
                
                <div className="mt-8 grid grid-cols-3 gap-3 w-full">
                  <ValueIndicator label="Mind" val={mind} color="bg-blue-500" />
                  <ValueIndicator label="Body" val={body} color="bg-emerald-500" />
                  <ValueIndicator label="Purpose" val={purpose} color="bg-violet-500" />
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    )
  }

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

// COMPONENTE PARA CONTROLE DE PARES (Lógica Soma 10)
const PairControl = ({ labelL, labelR, valL, valR, colorL, colorR, onChange }: any) => {
  return (
    <div className="group relative bg-slate-50/50 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition-all">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{labelL}</span>
          <span className="text-xl font-black" style={{ color: colorL }}>{valL}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center">
            <RefreshCw className="w-3 h-3 text-slate-300 group-hover:rotate-180 transition-transform duration-500" />
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{labelR}</span>
          <span className="text-xl font-black" style={{ color: colorR }}>{valR}</span>
        </div>
      </div>

      <div className="relative flex items-center">
        {/* Números de Referência */}
        <div className="absolute -top-1 left-0 right-0 flex justify-between px-1 pointer-events-none">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
            <span key={n} className="text-[8px] font-bold text-slate-300">{n}</span>
          ))}
        </div>
        
        <input
          type="range" min={0} max={10} step={0.5} value={valL}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 mt-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-800"
          style={{
            background: `linear-gradient(to right, ${colorL} 0%, ${colorL} ${(valL/10)*100}%, ${colorR} ${(valL/10)*100}%, ${colorR} 100%)`
          }}
        />
      </div>
      
      <div className="mt-3 flex justify-between items-center px-1">
        <span className={`text-[9px] font-bold transition-opacity ${valL > 5 ? 'opacity-100' : 'opacity-30'}`} style={{ color: colorL }}>PREFERÊNCIA {labelL.toUpperCase()}</span>
        <span className={`text-[9px] font-bold transition-opacity ${valR > 5 ? 'opacity-100' : 'opacity-30'}`} style={{ color: colorR }}>PREFERÊNCIA {labelR.toUpperCase()}</span>
      </div>
    </div>
  )
}

const ValueIndicator = ({ label, val, color }: any) => (
  <div className="flex flex-col items-center p-2 rounded-xl bg-white/50 border border-white/80">
    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 mb-1">{label}</span>
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <span className="text-sm font-black text-slate-700">{val}</span>
    </div>
  </div>
)

const TriangleVisualization = ({ data }: { data: ResultData }) => {
  const size = 300
  const centerX = size / 2
  const centerY = size / 2 + 10
  const radius = 120

  const L: Point = { x: centerX - (radius * Math.sqrt(3)) / 2, y: centerY + radius / 2 }
  const R: Point = { x: centerX + (radius * Math.sqrt(3)) / 2, y: centerY + radius / 2 }
  const T: Point = { x: centerX, y: centerY - radius }
  const Center: Point = { x: centerX, y: centerY }

  const pM = calculateIsoscelesPoint(data.prefMind, data.pairedMB.body, data.pairedMP.purpose, L, R, Center)
  const pB = calculateIsoscelesPoint(data.prefBody, data.pairedMB.mind, data.pairedBP.purpose, L, T, Center)
  const pP = calculateIsoscelesPoint(data.prefPurpose, data.pairedMP.mind, data.pairedBP.body, R, T, Center)

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-2xl">
        <polygon points={`${L.x},${L.y} ${R.x},${R.y} ${Center.x},${Center.y}`} fill="#3b82f6" fillOpacity="0.05" />
        <polygon points={`${L.x},${L.y} ${T.x},${T.y} ${Center.x},${Center.y}`} fill="#10b981" fillOpacity="0.05" />
        <polygon points={`${R.x},${R.y} ${T.x},${T.y} ${Center.x},${Center.y}`} fill="#8b5cf6" fillOpacity="0.05" />
        <polygon points={`${L.x},${L.y} ${R.x},${R.y} ${T.x},${T.y}`} fill="none" stroke="#e2e8f0" strokeWidth="1" />
        
        <polygon
          points={`${pM.x},${pM.y} ${pB.x},${pB.y} ${pP.x},${pP.y}`}
          fill="rgba(37, 99, 235, 0.15)"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        <circle cx={pM.x} cy={pM.y} r="5" fill="#3b82f6" stroke="white" strokeWidth="2" />
        <circle cx={pB.x} cy={pB.y} r="5" fill="#10b981" stroke="white" strokeWidth="2" />
        <circle cx={pP.x} cy={pP.y} r="5" fill="#8b5cf6" stroke="white" strokeWidth="2" />

        <text x={size/2} y={L.y + 20} textAnchor="middle" fontSize="10" fontWeight="900" fill="#3b82f6">MIND</text>
        <text x={L.x - 15} y={L.y - 60} textAnchor="middle" fontSize="10" fontWeight="900" fill="#10b981" transform={`rotate(-60, ${L.x-15}, ${L.y-60})`}>BODY</text>
        <text x={R.x + 15} y={R.y - 60} textAnchor="middle" fontSize="10" fontWeight="900" fill="#8b5cf6" transform={`rotate(60, ${R.x+15}, ${R.y-60})`}>PURPOSE</text>
      </svg>
    </div>
  )
}
