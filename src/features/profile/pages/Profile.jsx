import { useNavigate } from 'react-router-dom'
import { IdCard, Receipt, Calendar, Bike, ChevronRight, ShieldCheck } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { getIniciales } from '@/lib/formatters'
import { ROUTES } from '@/constants/routes'

const LINKS = [
  { icon: IdCard,   label: 'Mi credencial digital', to: ROUTES.CREDENTIAL },
  { icon: Calendar, label: 'Mis citas',             to: ROUTES.APPOINTMENTS },
  { icon: Receipt,  label: 'Mis pagos',             to: ROUTES.PAYMENTS },
]

export default function Profile() {
  const navigate        = useNavigate()
  const { currentUser } = useAuth()

  const nombre   = `${currentUser?.nombres} ${currentUser?.apellidos}`
  const vehiculo = currentUser?.vehiculo

  return (
    <div className="space-y-4 px-4 pb-28 pt-4">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Mi Perfil</h2>
        <Badge variant="info">DEMO</Badge>
      </div>

      {/* Header de usuario */}
      <Card variant="outlined" padding="lg">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
            {getIniciales(nombre)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-ink">{nombre}</p>
            <p className="truncate text-xs text-slate-500">{currentUser?.email}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Badge variant="success" size="sm">
                <ShieldCheck size={10} /> Certificado
              </Badge>
              {currentUser?.membresia === 'premium' && (
                <Badge variant="primary" size="sm">PREMIUM</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 pt-3 text-center">
          <div>
            <p className="text-base font-black text-ink">{currentUser?.scorePIK}</p>
            <p className="text-[10px] text-slate-400">Score PIK</p>
          </div>
          <div>
            <p className="text-base font-black text-ink">3/3</p>
            <p className="text-[10px] text-slate-400">Nivel verificación</p>
          </div>
          <div>
            <p className="text-base font-black text-ink">2027</p>
            <p className="text-[10px] text-slate-400">Vigencia</p>
          </div>
        </div>
      </Card>

      {/* Vehículo */}
      {vehiculo && (
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Mi vehículo</p>
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-100">
                <Bike size={19} className="text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">
                  {vehiculo.marca} {vehiculo.modelo} · {vehiculo.anio}
                </p>
                <p className="font-mono text-xs text-slate-500">Placa {vehiculo.placa}</p>
              </div>
              <Badge variant="success" size="sm">Seguro vigente</Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Accesos */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Mi cuenta</p>
        <div className="space-y-2">
          {LINKS.map(({ icon: Icon, label, to }) => (
            <Card key={to} variant="interactive" padding="md" onClick={() => navigate(to)}>
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100">
                  <Icon size={16} className="text-slate-500" />
                </div>
                <span className="flex-1 text-sm font-medium text-ink">{label}</span>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Nota demo */}
      <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
        <p className="text-[11px] leading-relaxed text-slate-400">
          Código PIK: <span className="font-mono font-semibold text-slate-500">{currentUser?.codigoPIK}</span>
          <br />
          Edición de datos y gestión de documentos disponibles en producción.
        </p>
      </div>
    </div>
  )
}
