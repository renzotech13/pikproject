import { useNavigate } from 'react-router-dom'
import { Receipt, ChevronRight, Plus } from 'lucide-react'
import { Card, Badge, StatusBadge, Button, EmptyState, Skeleton } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { listPagos } from '@/services/pagosService'
import { formatMXN } from '@/lib/formatters'
import { ROUTES } from '@/constants/routes'

const METODO_LABELS = {
  tarjeta:      'Tarjeta',
  mercado_pago: 'Mercado Pago',
  spei:         'SPEI',
}

const METODO_ICON = {
  tarjeta:      '💳',
  mercado_pago: '🔵',
  spei:         '🏦',
}

export default function PaymentsHistory() {
  const navigate        = useNavigate()
  const { currentUser } = useAuth()

  const { data: pagos, loading } = useAsync(
    () => listPagos(currentUser?.id),
    [currentUser?.id]
  )

  const lista = pagos ?? []

  return (
    <div className="space-y-5 px-4 pb-28 pt-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Mis Pagos</h2>
        <Badge variant="info">DEMO</Badge>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} height={80} className="w-full" />)}
        </div>
      )}

      {!loading && lista.length === 0 && (
        <EmptyState
          Icon={Receipt}
          title="Sin pagos registrados"
          description="Aquí verás el historial de todos tus pagos y comprobantes."
          action={
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => navigate(ROUTES.CHECKOUT)}
            >
              Realizar un pago
            </Button>
          }
        />
      )}

      {!loading && lista.length > 0 && (
        <div className="space-y-3">
          {lista.map((pago) => (
            <Card
              key={pago.id}
              variant="interactive"
              padding="md"
              onClick={() => navigate(ROUTES.PAYMENT_RECEIPT(pago.id), { state: { pago } })}
            >
              <div className="flex items-center gap-3">
                {/* Icono de método */}
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl">
                  {METODO_ICON[pago.metodo] ?? '💰'}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-ink">
                      {formatMXN(pago.monto)}
                    </p>
                    <StatusBadge estado={pago.estado} size="sm" />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{pago.concepto}</p>
                  <p className="text-[11px] text-slate-400">
                    {METODO_LABELS[pago.metodo] ?? pago.metodo} · {pago.codigoOperacion}
                  </p>
                </div>

                <ChevronRight size={16} className="shrink-0 text-slate-300" />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        fullWidth
        leftIcon={<Plus size={18} />}
        onClick={() => navigate(ROUTES.CHECKOUT)}
      >
        Nuevo pago
      </Button>
    </div>
  )
}
