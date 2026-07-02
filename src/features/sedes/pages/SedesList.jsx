import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, ChevronRight, Building2 } from 'lucide-react'
import { Card, Badge, Skeleton, EmptyState } from '@/components/ui'
import { useAsync } from '@/hooks/useAsync'
import { listSedes } from '@/services/sedesService'
import { listContainer, listItem } from '@/lib/motion'
import { ROUTES } from '@/constants/routes'

const TIPO_LABELS = {
  centro_certificacion: 'Centro de certificación',
  punto_inspeccion:     'Punto de inspección',
  movil:                'Unidad móvil',
}

const DISPONIBILIDAD_VARIANT = {
  alta:     'success',
  media:    'warning',
  baja:     'danger',
  sin_cupo: 'danger',
}

const DISPONIBILIDAD_LABEL = {
  alta:     'Alta disponibilidad',
  media:    'Disponibilidad media',
  baja:     'Poca disponibilidad',
  sin_cupo: 'Sin cupo',
}

export default function SedesList() {
  const navigate = useNavigate()
  const { data: sedes, loading } = useAsync(() => listSedes({ activa: true }), [])
  const lista = sedes ?? []

  return (
    <div className="space-y-4 px-4 pb-28 pt-4">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Sedes PIK</h2>
        <Badge variant="info">DEMO</Badge>
      </div>
      <p className="-mt-2 text-sm text-slate-500">
        Centros de certificación e inspección en Ciudad de México.
      </p>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} height={104} className="w-full" />)}
        </div>
      )}

      {!loading && lista.length === 0 && (
        <EmptyState
          Icon={Building2}
          title="Sin sedes disponibles"
          description="Pronto abriremos nuevos centros de certificación."
        />
      )}

      {!loading && lista.length > 0 && (
        <motion.div variants={listContainer} initial="hidden" animate="show" className="space-y-3">
          {lista.map((sede) => (
            <motion.div key={sede.id} variants={listItem}>
              <Card
                variant="interactive"
                padding="md"
                onClick={() => navigate(ROUTES.SEDE_DETAIL(sede.id))}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10">
                    <MapPin size={19} className="text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{sede.nombre}</p>
                    <p className="truncate text-xs text-slate-500">{sede.direccion}</p>
                    <p className="text-[11px] text-slate-400">
                      {TIPO_LABELS[sede.tipo] ?? sede.tipo} · L-V {sede.horario?.lunesViernes}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge variant={DISPONIBILIDAD_VARIANT[sede.disponibilidad] ?? 'neutral'} size="sm">
                        {DISPONIBILIDAD_LABEL[sede.disponibilidad] ?? sede.disponibilidad}
                      </Badge>
                      <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        {sede.calificacion} ({sede.totalResenas})
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={16} className="shrink-0 text-slate-300" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
