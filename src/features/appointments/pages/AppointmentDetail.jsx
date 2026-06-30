import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, CheckCircle2, Circle } from 'lucide-react'
import { Card, Badge, StatusBadge, Button, Skeleton } from '@/components/ui'
import { getCita } from '@/services/citasService'
import { getSede } from '@/services/sedesService'
import { formatMoney } from '@/lib/formatters'

const DIAS  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const TIPO_LABELS = {
  verificacion_inicial: 'Verificación inicial',
  inspeccion_tecnica:   'Inspección técnica',
  renovacion:           'Renovación',
  emision_credencial:   'Emisión de credencial',
}

function formatDate(fechaStr) {
  if (!fechaStr) return '—'
  const [y, m, d] = fechaStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${DIAS[date.getDay()]} ${d} ${MESES[m - 1]}`
}

export default function AppointmentDetail() {
  const { citaId } = useParams()
  const navigate   = useNavigate()

  const [cita, setCita]       = useState(null)
  const [sede, setSede]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCita(citaId).then((data) => {
      setCita(data)
      if (data?.sedeId) getSede(data.sedeId).then(setSede)
      setLoading(false)
    })
  }, [citaId])

  if (loading) {
    return (
      <div className="space-y-3 px-4 pt-4">
        <Skeleton height={64}  className="w-full" />
        <Skeleton height={180} className="w-full" />
        <Skeleton height={120} className="w-full" />
      </div>
    )
  }

  if (!cita) {
    return (
      <div className="px-4 pt-16 text-center">
        <p className="text-slate-500">Cita no encontrada.</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">Volver</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-4 pb-28 pt-4">

      {/* Status header */}
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10">
          <Calendar size={22} className="text-primary" />
        </div>
        <div>
          <p className="font-bold text-ink">{formatDate(cita.fecha)} · {cita.hora}</p>
          <StatusBadge estado={cita.estado} size="sm" />
        </div>
        <Badge variant="info" className="ml-auto shrink-0">DEMO</Badge>
      </div>

      {/* Detalle */}
      <Card variant="outlined" padding="md" className="space-y-3">
        {[
          { label: 'Código',    value: cita.codigoReserva },
          { label: 'Sede',      value: sede?.nombre ?? '—' },
          { label: 'Dirección', value: sede?.direccion ?? '—' },
          { label: 'Tipo',      value: TIPO_LABELS[cita.tipo] ?? cita.tipo },
          { label: 'Duración',  value: `${cita.duracionMin} minutos` },
          { label: 'Costo',     value: formatMoney(cita.costo) },
          { label: 'Pagada',    value: cita.pagada ? 'Sí' : 'No' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <span className="shrink-0 text-slate-500">{label}</span>
            <span className="text-right font-medium text-ink">{value}</span>
          </div>
        ))}
      </Card>

      {/* Checklist */}
      {cita.checklist?.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Requisitos
          </p>
          <Card variant="outlined" padding="md" className="space-y-3">
            {cita.checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {item.completado ? (
                  <CheckCircle2 size={18} className="shrink-0 text-success" />
                ) : (
                  <Circle size={18} className="shrink-0 text-slate-300" />
                )}
                <span className={item.completado ? 'text-slate-500 line-through' : 'text-slate-700'}>
                  {item.item}
                </span>
                {item.obligatorio && !item.completado && (
                  <span className="ml-auto shrink-0 text-[10px] font-bold text-danger">requerido</span>
                )}
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Nota */}
      {cita.notas && (
        <div className="rounded-xl bg-primary/5 p-3 text-xs text-slate-600">
          <span className="font-semibold">Nota: </span>{cita.notas}
        </div>
      )}
    </div>
  )
}
