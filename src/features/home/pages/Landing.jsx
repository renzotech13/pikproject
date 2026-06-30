import { useNavigate } from 'react-router-dom'
import { Shield, Calendar, Gift, IdCard, ChevronRight, CheckCircle } from 'lucide-react'

const FEATURES = [
  { icon: Shield, title: 'Certificación confiable', desc: 'Verifica tu identidad y tu moto en centros autorizados.' },
  { icon: Calendar, title: 'Citas sin filas', desc: 'Agenda y reprograma en segundos, desde el celular.' },
  { icon: Gift, title: 'Beneficios exclusivos', desc: 'Descuentos en repuestos, seguros, combustible y más.' },
  { icon: IdCard, title: 'Credencial digital', desc: 'Tu carnet PIK siempre disponible. Sin papel.' },
]

const STATS = [
  { value: '12,480', label: 'Motociclistas' },
  { value: '8,932', label: 'Certificados' },
  { value: '2 min', label: 'Para agendar' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto min-h-dvh max-w-app">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary to-indigo-500 px-6 pb-16 pt-14 text-white">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight">PIK</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            beta
          </span>
        </div>
        <h1 className="mt-4 text-[2rem] font-bold leading-tight">
          Certifica tu moto.<br />
          Circula tranquilo.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/80">
          La plataforma que conecta a motociclistas con centros de certificación, beneficios y normativa vigente.
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {STATS.map(({ value, label }) => (
            <div key={label} className="rounded-xl bg-white/10 p-3 text-center">
              <p className="text-base font-bold">{value}</p>
              <p className="text-[10px] text-white/70">{label}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate('/app')}
            className="flex-1 rounded-xl bg-white py-3 text-sm font-bold text-primary shadow-card"
          >
            Ver demo
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex-1 rounded-xl border border-white/30 bg-white/10 py-3 text-sm font-bold text-white"
          >
            Ingresar
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-8">
        <h2 className="mb-1 text-lg font-bold text-ink">¿Qué incluye PIK?</h2>
        <p className="mb-5 text-sm text-slate-500">Todo lo que un motociclista necesita, en un solo lugar.</p>
        <div className="space-y-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-card">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/app')}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-card"
        >
          Explorar demo completo
          <ChevronRight size={16} />
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">
          Integración real con MTC, SUTRAN y pasarelas de pago próximamente.
        </p>
      </div>
    </div>
  )
}
