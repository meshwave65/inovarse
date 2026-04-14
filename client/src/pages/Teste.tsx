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
      console.log("Iniciando submissão de lead...");
      const leadResult = await submitLeadMutation.mutateAsync({
        nome: leads.nome.trim(),
        telefone: leads.telefone.trim(),
        email: leads.email.trim(),
      })

      if (leadResult.success && leadResult.leadId) {
        console.log("Lead salvo com ID:", leadResult.leadId, ". Salvando resultado...");
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
        } else {
          toast.error(`Erro ao salvar resultado: ${resultSave.message}`)
        }
      } else {
        toast.error(`Erro ao registrar lead: ${leadResult.message}`)
      }
    } catch (err: any) {
      console.error("Erro fatal na submissão:", err)
      toast.error(`Erro de conexão: ${err.message || "Verifique o console do navegador"}`)
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
                  Compreender seu padrão MBP ajuda na tomada de decisões mais alinhadas com quem você é.
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
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.08),transparent_35%)]" />

        <div className="relative flex min-h-screen items-center justify-center px-4 py-8 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="w-full max-w-6xl"
          >
            {/* SEÇÃO 1: PREFERÊNCIAS BÁSICAS - PAINEL COMPACTO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Painel de Controle - Esquerda */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-white/95 to-white/85 p-6 shadow-[0_28px_90px_-38px_rgba(15,23,42,0.38)] backdrop-blur-2xl"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-display tracking-[-0.02em] text-slate-800 mb-1">
                    Suas Preferências
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Distribua sua energia entre as 3 dimensões (Total: 10)
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Mind Slider */}
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200/50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">🧠 Mind</span>
                      <span className="text-xl font-bold text-blue-600">{mind}</span>
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
                      className="w-full h-2 bg-blue-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                      style={{
                        background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${(mind / 10) * 100}%, rgb(226, 232, 240) ${(mind / 10) * 100}%, rgb(226, 232, 240) 100%)`
                      }}
                    />
                  </div>

                  {/* Body Slider */}
                  <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-50/50 border border-emerald-200/50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">💪 Body</span>
                      <span className="text-xl font-bold text-emerald-600">{body}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, 10 - mind)}
                      step={0.5}
                      value={body}
                      onChange={(e) => setBody(Number(e.target.value))}
                      className="w-full h-2 bg-emerald-200 rounded-full appearance-none cursor-pointer accent-emerald-600"
                      style={{
                        background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${(body / (10 - mind)) * 100}%, rgb(226, 232, 240) ${(body / (10 - mind)) * 100}%, rgb(226, 232, 240) 100%)`
                      }}
                    />
                  </div>

                  {/* Purpose - Apenas Exibição */}
                  <div className="rounded-xl bg-gradient-to-br from-violet-50 to-violet-50/50 border border-violet-200/50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-[0.15em] text-violet-700">✨ Purpose</span>
                      <span className="text-xl font-bold text-violet-600">{purpose}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-violet-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-300"
                        style={{ width: `${(purpose / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200/50">
                  <p className="text-xs text-blue-700 font-medium">
                    💡 <strong>Dica:</strong> Mind + Body + Purpose = 10
                  </p>
                </div>
              </motion.div>

              {/* Visualização do Triângulo - Direita */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_28px_90px_-38px_rgba(15,23,42,0.38)] backdrop-blur-2xl flex items-center justify-center"
              >
                <div className="w-full">
                  <p className="text-xs text-slate-500 font-medium text-center mb-4">Visualização em Tempo Real</p>
                  <TriangleVisualization data={{
                    altMind: mind.toString(),
                    altBody: body.toString(),
                    altPurpose: purpose.toString(),
                    deslocMind: "0",
                    deslocBody: "0",
                    deslocPurpose: "0",
                    prefMind: mind,
                    prefBody: body,
                    prefPurpose: purpose,
                    pairedMB,
                    pairedBP,
                    pairedMP,
                  }} />
                </div>
              </motion.div>
            </div>

            {/* SEÇÃO 2: PREFERÊNCIAS RELATIVAS - PAINEL COMPACTO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-white/95 to-white/85 p-6 shadow-[0_28px_90px_-38px_rgba(15,23,42,0.38)] backdrop-blur-2xl mb-6"
            >
              <div className="mb-6">
                <h2 className="text-lg font-display tracking-[-0.02em] text-slate-800 mb-1">
                  Preferências Relativas (Pares)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Quando precisa escolher entre dois aspectos, qual você prefere? (Mova para indicar importância)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mind vs Body */}
                <PairSlider
                  label1="🧠 Mind"
                  label2="💪 Body"
                  color1="blue"
                  color2="emerald"
                  value1={pairedMB.mind}
                  value2={pairedMB.body}
                  onChange={(val) => setPairedMB({ mind: val, body: 10 - val })}
                />

                {/* Body vs Purpose */}
                <PairSlider
                  label1="💪 Body"
                  label2="✨ Purpose"
                  color1="emerald"
                  color2="violet"
                  value1={pairedBP.body}
                  value2={pairedBP.purpose}
                  onChange={(val) => setPairedBP({ body: val, purpose: 10 - val })}
                />

                {/* Mind vs Purpose */}
                <PairSlider
                  label1="🧠 Mind"
                  label2="✨ Purpose"
                  color1="blue"
                  color2="violet"
                  value1={pairedMP.mind}
                  value2={pairedMP.purpose}
                  onChange={(val) => setPairedMP({ mind: val, purpose: 10 - val })}
                />
              </div>
            </motion.div>

            {/* Botão de Cálculo */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={calcular}
              disabled={loading}
              className={`${primaryButtonClass} w-full py-4 text-base`}
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

// Componente para Sliders de Pares com Lógica de Soma 10
const PairSlider = ({
  label1,
  label2,
  color1,
  color2,
  value1,
  value2,
  onChange,
}: {
  label1: string
  label2: string
  color1: string
  color2: string
  value1: number
  value2: number
  onChange: (val: number) => void
}) => {
  const colorMap: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
    blue: { bg: "bg-blue-50", border: "border-blue-200/50", text: "text-blue-700", gradient: "from-blue-500 to-blue-400" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200/50", text: "text-emerald-700", gradient: "from-emerald-500 to-emerald-400" },
    violet: { bg: "bg-violet-50", border: "border-violet-200/50", text: "text-violet-700", gradient: "from-violet-500 to-violet-400" },
  }

  const c1 = colorMap[color1]
  const c2 = colorMap[color2]

  return (
    <div className={`rounded-xl ${c1.bg} border ${c1.border} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">{label1}</span>
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">{label2}</span>
      </div>

      {/* Valores Numéricos */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{value1}</div>
        </div>
        <div className="text-xs text-slate-400 font-semibold">↔</div>
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-600">{value2}</div>
        </div>
      </div>

      {/* Slider com Gradiente */}
      <input
        type="range"
        min={0}
        max={10}
        step={0.5}
        value={value1}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${(value1 / 10) * 100}%, rgb(16, 185, 129) ${(value1 / 10) * 100}%, rgb(16, 185, 129) 100%)`
        }}
      />

      <div className="mt-2 text-center">
        <span className="text-xs text-slate-500 font-medium">
          {value1 > 5 ? `← ${label1} mais importante` : value1 < 5 ? `${label2} mais importante →` : "Equilibrado"}
        </span>
      </div>
    </div>
  )
}

const TriangleVisualization = ({ data }: { data: ResultData }) => {
  const size = 320
  const centerX = size / 2
  const centerY = size / 2 + 10
  const radius = 130

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
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/82 p-3 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.08),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.08),transparent_26%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.08),transparent_24%)]" />
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

        <circle cx={Center.x} cy={Center.y} r="3" fill="#94a3b8" opacity="0.5" />

        <circle cx={pM.x} cy={pM.y} r="5" fill="#3b82f6" stroke="white" strokeWidth="2" />
        <circle cx={pB.x} cy={pB.y} r="5" fill="#10b981" stroke="white" strokeWidth="2" />
        <circle cx={pP.x} cy={pP.y} r="5" fill="#8b5cf6" stroke="white" strokeWidth="2" />

        <text
          x={size / 2}
          y={L.y + 22}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#1d4ed8"
        >
          MIND
        </text>
        <text
          x={L.x - 14}
          y={L.y - (L.y - T.y) / 2}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#047857"
          transform={`rotate(-60, ${L.x - 14}, ${L.y - (L.y - T.y) / 2})`}
        >
          BODY
        </text>
        <text
          x={R.x + 14}
          y={R.y - (R.y - T.y) / 2}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#6d28d9"
          transform={`rotate(60, ${R.x + 14}, ${R.y - (R.y - T.y) / 2})`}
        >
          PURPOSE
        </text>
      </svg>
    </motion.div>
  )
}
