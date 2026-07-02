import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Star, Phone, Calendar, Users } from 'lucide-react'
import { Card, Badge, Button, Skeleton } from '@/components/ui'
import { getSede } from '@/services/sedesService'
import { ROUTES } from '@/constants/routes'

const SERVICIO_LABELS = {
  verificacion_identidad: 'Verificación de identidad',
  inspeccion_tecnica:     'Inspección técnica',
  emision_credencial:     'Emisión de credencial',
  renovacion:             'Renovación',
}

export default function SedeDetail() {
  const { sedeId } = useParams()
  const navigate   = useNavigate()

  const [sede, setSede]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSede(sedeId).then((data) => {
      setSede(data)
      setLoading(false)
    })
  }, [sedeId])

  if (loading) {
    return (
      <div className="space-y-3 px-4 pt-4">
        <Skeleton height={144} className="w-full" />
        <Skeleton height={100} className="w-full" />
        <Skeleton height={100} className="w-full" />
      </div>
    )
  }

  if (!sede) {
    return (
      <div className="px-4 pt-16 text-center">
        <p className="text-slate-500">Sede no encontrada.</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">Volver</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-4 pb-28 pt-4">

      {/* Mapa mock */}
      <div className="relative h-36 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
        {/* Cuadrícula tipo mapa */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(90deg, #CBD5E1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute -inset-3 animate-ping rounded-full bg-primary/20" />
          <div className="relative grid h-10 w-10 place-items-center rounded-full bg-primary text-white shadow-float">
            <MapPin size={19} />
          </div>
        </div>
        <span className="absolute bottom-2 right-3 font-mono text-[9px] text-slate-400">
          {sede.coordenadas?.lat}, {sede.coordenadas?.lng}
        </span>
        <Badge variant="info" size="sm" className="absolute left-3 top-3">Mapa demo · Google Maps en producción</Badge>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-ink">{sede.nombre}</h2>
        <p className="text-sm text-slate-500">{sede.direccion}</p>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-0.5">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {sede.calificacion} ({sede.totalResenas} reseñas)
          </span>
          <span className="flex items-center gap-0.5">
            <Users size={11} /> {sede.capacidadDiaria} citas/día
          </span>
        </div>
      </div>

      {/* Horario */}
      <Card variant="outlined" padding="md" className="space-y-2.5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Horario</p>
        {[
          ['Lunes a viernes', sede.horario?.lunesViernes],
          ['Sábado',          sede.horario?.sabado],
          ['Domingo',         sede.horario?.domingo],
        ].map(([dia, horas]) => (
          <div key={dia} className="flex justify-between text-sm">
            <span className="text-slate-500">{dia}</span>
            <span className="font-semibold text-ink">{horas}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-slate-50 pt-2 text-sm">
          <span className="flex items-center gap-1.5 text-slate-500"><Phone size={13} /> Teléfono</span>
          <span className="font-semibold text-ink">{sede.telefono}</span>
        </div>
      </Card>

      {/* Servicios */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Servicios disponibles
        </p>
        <div className="flex flex-wrap gap-1.5">
          {sede.servicios.map((s) => (
            <span key={s} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              {SERVICIO_LABELS[s] ?? s}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        leftIcon={<Calendar size={17} />}
        onClick={() => navigate(ROUTES.BOOK_APPOINTMENT)}
      >
        Agendar cita en esta sede
      </Button>
    </div>
  )
}
