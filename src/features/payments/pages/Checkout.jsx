import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CreditCard, Smartphone, Building2 } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { procesarPago } from '@/services/pagosService'
import { formatMXN } from '@/lib/formatters'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'
import CardForm           from '../components/CardForm'
import MercadoPagoPanel  from '../components/MercadoPagoPanel'
import SpeiPanel          from '../components/SpeiPanel'

// ── Datos de demo (en producción vendrían de location.state o query params) ──
const CONCEPTO_DEMO = 'Verificación inicial PIK'
const MONTO_DEMO    = 850  // MXN

const METODOS = [
  { id: 'tarjeta',      label: 'Tarjeta',       icon: CreditCard  },
  { id: 'mercado_pago', label: 'Mercado Pago',  icon: Smartphone  },
  { id: 'spei',         label: 'SPEI',          icon: Building2   },
]

export default function Checkout() {
  const navigate        = useNavigate()
  const location        = useLocation()
  const { currentUser } = useAuth()

  // Acepta datos desde navigate state (BookAppointment) o usa demo
  const {
    concepto   = CONCEPTO_DEMO,
    monto      = MONTO_DEMO,
    citaId,
    sedeNombre,
    fecha,
    hora,
  } = location.state ?? {}

  const [method,     setMethod]     = useState('tarjeta')
  const [processing, setProcessing] = useState(false)
  const [error,      setError]      = useState(null)

  async function handlePay(extraData = {}) {
    setProcessing(true)
    setError(null)
    const { pago, error: err } = await procesarPago({
      usuarioId: currentUser.id,
      monto,
      moneda:   'MXN',
      concepto,
      citaId,
      metodo:   method,
      ...extraData,
    })
    if (err) {
      setError(err)
      setProcessing(false)
      return
    }
    navigate(ROUTES.PAYMENT_RECEIPT(pago.id), { state: { pago, citaId } })
  }

  return (
    <div className="space-y-5 px-4 pb-28 pt-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Pago seguro</h2>
        <Badge variant="info">DEMO</Badge>
      </div>

      {/* Resumen del pago */}
      <Card variant="outlined" padding="md">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Servicio</span>
            <span className="font-semibold text-ink">{concepto}</span>
          </div>
          {sedeNombre && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Sede</span>
              <span className="font-semibold text-ink">{sedeNombre}</span>
            </div>
          )}
          {fecha && hora && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Fecha</span>
              <span className="font-semibold text-ink">{fecha} · {hora}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Moneda</span>
            <span className="font-semibold text-ink">MXN (Pesos mexicanos)</span>
          </div>
          <div className="border-t border-slate-100 pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-ink">Total</span>
              <span className="text-xl font-black text-ink">{formatMXN(monto)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Selector de método */}
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">Método de pago</p>
        <div className="grid grid-cols-3 gap-2">
          {METODOS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => { setMethod(id); setError(null) }}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-semibold transition-all',
                method === id
                  ? id === 'mercado_pago'
                    ? 'border-[#009EE3] bg-[#009EE3]/5 text-[#009EE3]'
                    : 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              )}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel activo */}
      <div>
        {method === 'tarjeta' && (
          <CardForm
            monto={monto}
            onPay={(cardData) => handlePay(cardData)}
            loading={processing}
            error={error}
          />
        )}
        {method === 'mercado_pago' && (
          <MercadoPagoPanel
            monto={monto}
            concepto={concepto}
            onPay={() => handlePay()}
            loading={processing}
          />
        )}
        {method === 'spei' && (
          <SpeiPanel
            monto={monto}
            concepto={concepto}
            usuarioId={currentUser.id}
            onPay={() => handlePay()}
            loading={processing}
          />
        )}
      </div>

      {/* Badge legal / comercial */}
      <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
        <Badge variant="info" className="mb-1.5">DEMO</Badge>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Pasarela integrada con{' '}
          <span className="font-semibold text-[#009EE3]">Mercado Pago</span>
          {' '}— Certificación{' '}
          <span className="font-semibold">PCI DSS</span> activa en producción.
          Esta pantalla es una simulación con datos de prueba.
        </p>
      </div>
    </div>
  )
}
