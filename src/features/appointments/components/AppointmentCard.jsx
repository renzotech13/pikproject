import { Calendar, ChevronRight } from 'lucide-react'
import { Card, StatusBadge } from '@/components/ui'

const DIAS  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const TIPO_LABELS = {
  verificacion_inicial: 'Verificación inicial',
  inspeccion_tecnica:   'Inspección técnica',
  renovacion:           'Renovación',
  emision_credencial:   'Emisión de credencial',
}

// Usa constructor local para evitar off-by-one por zona horaria UTC vs. local
function formatDate(fechaStr) {
  if (!fechaStr) return '—'
  const [y, m, d] = fechaStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${DIAS[date.getDay()]} ${d} ${MESES[m - 1]}`
}

// Props: cita (object), sedeNombre (string), onClick (fn)
export default function AppointmentCard({ cita, sedeNombre, onClick }) {
  const checklist   = cita.checklist ?? []
  const completados = checklist.filter((i) => i.completado).length

  return (
    <Card variant="interactive" padding="md" onClick={onClick}>
      <div className="flex items-center gap-3">
        {/* Icono */}
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10">
          <Calendar size={19} className="text-primary" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-semibold text-ink">
              {formatDate(cita.fecha)} · {cita.hora}
            </p>
            <StatusBadge estado={cita.estado} size="sm" />
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {sedeNombre ?? 'Sede PIK'}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {TIPO_LABELS[cita.tipo] ?? cita.tipo}
            </span>
            {checklist.length > 0 && (
              <span className="text-[10px] text-slate-400">
                · {completados}/{checklist.length} req.
              </span>
            )}
          </div>
        </div>

        <ChevronRight size={16} className="shrink-0 text-slate-300" />
      </div>

      {/* Barra de progreso del checklist */}
      {checklist.length > 0 && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-1 rounded-full bg-primary/60 transition-all"
            style={{ width: `${(completados / checklist.length) * 100}%` }}
          />
        </div>
      )}
    </Card>
  )
}
