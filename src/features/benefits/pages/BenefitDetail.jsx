import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Star, MapPin, Copy, Ticket, CheckCircle2 } from 'lucide-react'
import { Card, Badge, Button, Skeleton } from '@/components/ui'
import { useToast } from '@/hooks/useToast'
import { getAliado, canjearBeneficio, getCanjeActivo } from '@/services/beneficiosService'
import { getIniciales } from '@/lib/formatters'

export default function BenefitDetail() {
  const { aliadoId } = useParams()
  const navigate     = useNavigate()
  const { show }     = useToast()

  const [aliado,  setAliado]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [canje,   setCanje]   = useState(null)
  const [canjeando, setCanjeando] = useState(false)

  useEffect(() => {
    getAliado(aliadoId).then((data) => {
      setAliado(data)
      setCanje(getCanjeActivo(aliadoId))
      setLoading(false)
    })
  }, [aliadoId])

  async function handleCanjear() {
    setCanjeando(true)
    const result = await canjearBeneficio(aliadoId)
    setCanje(result)
    setCanjeando(false)
    show({
      title:       '¡Beneficio activado!',
      description: `Presenta el código ${result.codigo} en caja.`,
      variant:     'success',
    })
  }

  function copiarCodigo() {
    navigator.clipboard?.writeText(canje.codigo)
    show({ title: 'Código copiado', variant: 'success' })
  }

  if (loading) {
    return (
      <div className="space-y-3 px-4 pt-4">
        <Skeleton height={120} className="w-full" />
        <Skeleton height={180} className="w-full" />
      </div>
    )
  }

  if (!aliado) {
    return (
      <div className="px-4 pt-16 text-center">
        <p className="text-slate-500">Beneficio no encontrado.</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">Volver</Button>
      </div>
    )
  }

  const { beneficio } = aliado

  return (
    <div className="space-y-4 px-4 pb-28 pt-4">

      {/* Hero del aliado */}
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-base font-bold text-primary">
          {getIniciales(aliado.nombre)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h2 className="text-base font-bold text-ink">{aliado.nombre}</h2>
            {aliado.membresiaRequerida === 'premium' && <Badge variant="primary" size="sm">PRO</Badge>}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-0.5">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              {aliado.calificacion}
            </span>
            <span>· {aliado.totalCanjes.toLocaleString('es-MX')} canjes</span>
          </div>
        </div>
        <Badge variant="info" className="shrink-0">DEMO</Badge>
      </div>

      <p className="text-sm text-slate-500">{aliado.descripcion}</p>

      {/* Beneficio destacado */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-indigo-700 p-5 text-white">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/60">
          <Ticket size={12} /> Beneficio PIK
        </div>
        <p className="mt-2 text-xl font-black leading-tight">{beneficio.titulo}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/70">{beneficio.condiciones}</p>
        <p className="mt-3 text-[10px] text-white/50">
          Vigente hasta {beneficio.vigenciaHasta}
        </p>
      </div>

      {/* Ubicaciones */}
      <div className="flex flex-wrap gap-1.5">
        {aliado.ubicaciones.map((u) => (
          <span key={u} className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            <MapPin size={10} /> {u}
          </span>
        ))}
      </div>

      {/* Canje */}
      <AnimatePresence mode="wait">
        {canje ? (
          <motion.div
            key="canjeado"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card variant="outlined" padding="lg" className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm font-bold text-success">
                <CheckCircle2 size={16} /> Beneficio activado
              </div>

              <div className="rounded-xl bg-white p-2.5 ring-1 ring-slate-100">
                <QRCodeSVG value={`https://pik.mx/canje/${canje.codigo}`} size={120} fgColor="#0F172A" />
              </div>

              <button
                onClick={copiarCodigo}
                className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 font-mono text-base font-black tracking-wider text-ink transition hover:bg-slate-100"
              >
                {canje.codigo}
                <Copy size={14} className="text-slate-400" />
              </button>

              <p className="text-center text-[11px] text-slate-400">
                Presenta este código en caja. Expira en 48 horas.
              </p>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="sin-canje" exit={{ opacity: 0 }}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={canjeando}
              leftIcon={<Ticket size={17} />}
              onClick={handleCanjear}
            >
              Canjear beneficio
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
