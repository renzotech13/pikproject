import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Download, Mail, Home, Clock } from 'lucide-react'
import { Card, Badge, Button, Skeleton } from '@/components/ui'
import { getPago } from '@/services/pagosService'
import { confirmarCita } from '@/services/citasService'
import { formatMXN } from '@/lib/formatters'
import { ROUTES } from '@/constants/routes'

const METODO_LABELS = {
  tarjeta:      'Tarjeta bancaria',
  mercado_pago: 'Mercado Pago',
  spei:         'Transferencia SPEI',
}

const DIAS  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function formatFecha(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()} · ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

function downloadComprobante(pago) {
  const lines = [
    '════════════════════════════════════',
    '       COMPROBANTE DE PAGO PIK      ',
    '════════════════════════════════════',
    '',
    `Código de operación : ${pago.codigoOperacion}`,
    `Serie / Folio       : ${pago.comprobante?.serie}-${pago.comprobante?.numero}`,
    `Fecha               : ${formatFecha(pago.fecha)}`,
    `Concepto            : ${pago.concepto}`,
    `Monto               : ${formatMXN(pago.monto)} ${pago.moneda}`,
    `Método              : ${METODO_LABELS[pago.metodo] ?? pago.metodo}`,
    `Estado              : ${pago.estado.toUpperCase()}`,
    '',
    '════════════════════════════════════',
    'Este documento es un comprobante de',
    'demostración generado por PIK Demo.',
    'En producción se emite CFDI timbrado.',
    '════════════════════════════════════',
  ].join('\n')

  const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `comprobante-${pago.codigoOperacion}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export default function PaymentReceipt() {
  const { pagoId }  = useParams()
  const location    = useLocation()
  const navigate    = useNavigate()

  const citaId            = location.state?.citaId ?? null
  const [pago,    setPago]    = useState(location.state?.pago ?? null)
  const [loading, setLoading] = useState(!pago)

  // Fallback: carga desde servicio si no viene en state (eg. recarga de página)
  useEffect(() => {
    if (pago) return
    getPago(pagoId).then((data) => {
      setPago(data)
      setLoading(false)
    })
  }, [pagoId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Confirma la cita en _store cuando el pago se completa (no aplica a SPEI en proceso)
  useEffect(() => {
    if (!pago || !citaId || pago.estado !== 'completado') return
    confirmarCita(citaId)
  }, [pago?.id, citaId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="space-y-3 px-4 pt-4">
        <Skeleton height={200} className="w-full" />
        <Skeleton height={160} className="w-full" />
      </div>
    )
  }

  if (!pago) {
    return (
      <div className="px-4 pt-16 text-center">
        <p className="text-slate-500">Comprobante no encontrado.</p>
        <Button variant="ghost" onClick={() => navigate(ROUTES.APP)} className="mt-4">
          Ir al inicio
        </Button>
      </div>
    )
  }

  const isSpei = pago.metodo === 'spei'

  return (
    <div className="space-y-5 px-4 pb-28 pt-6">

      {/* Hero de éxito */}
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`grid h-20 w-20 place-items-center rounded-full ${
            isSpei ? 'bg-warning/10' : 'bg-success/10'
          }`}
        >
          {isSpei
            ? <Clock     size={40} className="text-warning" />
            : <CheckCircle2 size={40} className="text-success" />
          }
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-1"
        >
          <h2 className="text-xl font-black text-ink">
            {isSpei ? 'Transferencia registrada' : '¡Pago exitoso!'}
          </h2>
          <p className="text-sm text-slate-500">
            {isSpei
              ? 'Verificaremos tu transferencia SPEI en los próximos minutos.'
              : 'Tu certificación PIK ha sido procesada correctamente.'}
          </p>
        </motion.div>

        <Badge variant="info">DEMO</Badge>
      </div>

      {/* Detalle del comprobante */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card variant="outlined" padding="md" className="space-y-3">
          {/* Código de operación prominente */}
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Código de operación
            </p>
            <p className="mt-1 font-mono text-lg font-black text-ink tracking-wider">
              {pago.codigoOperacion}
            </p>
          </div>

          {[
            { label: 'Folio',     value: `${pago.comprobante?.serie}-${pago.comprobante?.numero}` },
            { label: 'Concepto',  value: pago.concepto },
            { label: 'Método',    value: METODO_LABELS[pago.metodo] ?? pago.metodo },
            { label: 'Monto',     value: `${formatMXN(pago.monto)} MXN` },
            { label: 'Estado',    value: isSpei ? 'En proceso' : 'Completado' },
            { label: 'Fecha',     value: formatFecha(pago.fecha) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 text-sm">
              <span className="shrink-0 text-slate-500">{label}</span>
              <span className="text-right font-medium text-ink">{value}</span>
            </div>
          ))}
        </Card>
      </motion.div>

      {/* Notificación de email */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-start gap-3 rounded-xl bg-success/10 px-4 py-3"
      >
        <Mail size={16} className="mt-0.5 shrink-0 text-success" />
        <p className="text-sm text-slate-700">
          Hemos enviado tu comprobante al{' '}
          <span className="font-semibold">correo registrado</span>.
          Revisa también tu carpeta de spam.
        </p>
      </motion.div>

      {/* Acciones */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <Button
          variant="outline"
          size="lg"
          fullWidth
          leftIcon={<Download size={17} />}
          onClick={() => downloadComprobante(pago)}
        >
          Descargar comprobante
        </Button>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<Home size={17} />}
          onClick={() => navigate(citaId ? ROUTES.APPOINTMENTS : ROUTES.APP)}
        >
          {citaId ? 'Ver mis citas' : 'Volver al inicio'}
        </Button>
      </motion.div>

      {/* Nota legal */}
      <p className="text-center text-[11px] leading-relaxed text-slate-400">
        Pasarela integrada con{' '}
        <span className="font-semibold text-[#009EE3]">Mercado Pago</span>
        {' '}— Certificación <span className="font-semibold">PCI DSS</span> activa en producción.
      </p>
    </div>
  )
}
