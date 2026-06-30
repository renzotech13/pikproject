import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ShieldCheck, Gift, IdCard, ChevronRight, MapPin } from 'lucide-react'
import { listContainer, listItem } from '@/lib/motion'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/routes'
import { Card, Badge, StatusBadge, Button } from '@/components/ui'

// Próxima cita hardcoded para la demo (servicio real se implementa en la fase de features)
const NEXT_CITA = {
  fechaDisplay: 'Sáb 5 Jul · 10:30 am',
  sede: 'PIK Centro · San Isidro',
  tipo: 'Renovación',
  estado: 'confirmada',
}

const QUICK_ACTIONS = [
  { icon: Calendar,     label: 'Citas',        to: ROUTES.APPOINTMENTS, iconCn: 'bg-primary/10 text-primary' },
  { icon: ShieldCheck,  label: 'Verificación', to: ROUTES.VERIFICATION, iconCn: 'bg-success/10 text-success' },
  { icon: Gift,         label: 'Beneficios',   to: ROUTES.BENEFITS,     iconCn: 'bg-purple-100 text-purple-600' },
  { icon: IdCard,       label: 'Credencial',   to: ROUTES.CREDENTIAL,   iconCn: 'bg-amber-100 text-amber-600' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function HomeDashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const isCert = currentUser?.estadoCertificacion === 'certificado'
  const score  = currentUser?.scorePIK ?? 0

  return (
    <div className="space-y-4 px-4 pb-28 pt-4">

      {/* ── Saludo ─────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs text-slate-500">{greeting()}</p>
        <h2 className="text-lg font-bold text-ink">
          {currentUser?.nombres} {currentUser?.apellidos}
        </h2>
      </div>

      {/* ── Tarjeta de certificación ────────────────────────────────── */}
      <div
        className={`rounded-2xl p-5 text-white ${
          isCert
            ? 'bg-gradient-to-br from-success to-emerald-700'
            : 'bg-gradient-to-br from-warning to-amber-600'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            {/* Badge de estado — usa el componente Badge con estilo sobre oscuro */}
            <Badge
              variant={isCert ? 'success' : 'warning'}
              size="sm"
              className="border border-white/30 bg-white/20 text-white"
            >
              {isCert ? '✓ Certificado Vigente' : '⏳ En Proceso'}
            </Badge>
            <p className="font-mono text-sm font-semibold tracking-wide">
              {currentUser?.codigoPIK ?? '—'}
            </p>
          </div>
          <ShieldCheck size={32} className="shrink-0 opacity-20" />
        </div>

        <p className="mt-2 text-xs text-white/70">
          {isCert
            ? `Vence el ${currentUser?.fechaVencimiento}`
            : 'Completa tu proceso de verificación para activar tu credencial.'}
        </p>

        {/* Score PIK */}
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-white/80">
            <span>Score PIK</span>
            <span className="font-bold">{score} / 1000</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-1.5 rounded-full bg-white transition-all duration-500"
              style={{ width: `${(score / 1000) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Próxima cita ─────────────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Próxima Cita</p>
        <Card variant="interactive" padding="md" onClick={() => navigate(ROUTES.APPOINTMENTS)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10">
                <Calendar size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{NEXT_CITA.fechaDisplay}</p>
                <p className="text-xs text-slate-500">{NEXT_CITA.sede}</p>
                <p className="text-xs text-slate-400">{NEXT_CITA.tipo}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {/* StatusBadge consume el mapa ESTADO_COLOR + ESTADO_LABEL */}
              <StatusBadge estado={NEXT_CITA.estado} size="sm" />
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Acciones rápidas ─────────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Acciones rápidas</p>
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {QUICK_ACTIONS.map(({ icon: Icon, label, to, iconCn }) => (
            <motion.div key={to} variants={listItem}>
              <Card variant="interactive" padding="md" onClick={() => navigate(to)}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${iconCn}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-medium text-slate-600">{label}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Sede más cercana ─────────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Sede más cercana</p>
        <Card variant="interactive" padding="md" onClick={() => navigate(ROUTES.SEDES)}>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10">
              <MapPin size={18} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">PIK Centro · San Isidro</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="success" size="sm">Alta disponibilidad</Badge>
                <span className="text-[11px] text-slate-400">4.7 ★</span>
              </div>
            </div>
            <ChevronRight size={16} className="shrink-0 text-slate-300" />
          </div>
        </Card>
      </div>

      {/* ── CTA principal ────────────────────────────────────────────── */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        leftIcon={<Calendar size={18} />}
        onClick={() => navigate(ROUTES.BOOK_APPOINTMENT)}
      >
        Agendar nueva cita
      </Button>

    </div>
  )
}
