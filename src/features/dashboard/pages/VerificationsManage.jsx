import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Badge, StatusBadge, Input } from '@/components/ui'
import { cn } from '@/lib/cn'
import { getIniciales } from '@/lib/formatters'

// Mock extendido — 2 reales (usuarios.json) + 6 generados para el demo
const MOCK_USERS = [
  { id: 'usr_001', nombres: 'Carlos',   apellidos: 'Ramírez Herrera',   dni: '44556677', estadoCertificacion: 'certificado',    scorePIK: 820, membresia: 'premium', distrito: 'Cuauhtémoc',          fechaRegistro: '2025-11-02' },
  { id: 'usr_002', nombres: 'Lucía',    apellidos: 'González Morales',  dni: '70123456', estadoCertificacion: 'en_proceso',     scorePIK: 540, membresia: 'free',    distrito: 'Iztapalapa',          fechaRegistro: '2026-06-10' },
  { id: 'usr_003', nombres: 'Marco',    apellidos: 'López Jiménez',     dni: '63489201', estadoCertificacion: 'pendiente_pago', scorePIK: 680, membresia: 'free',    distrito: 'Gustavo A. Madero',   fechaRegistro: '2026-05-22' },
  { id: 'usr_004', nombres: 'Andrea',   apellidos: 'Martínez Ruiz',     dni: '55123890', estadoCertificacion: 'vencido',        scorePIK: 390, membresia: 'premium', distrito: 'Coyoacán',            fechaRegistro: '2025-08-14' },
  { id: 'usr_005', nombres: 'José',     apellidos: 'Hernández Sánchez', dni: '41872345', estadoCertificacion: 'certificado',    scorePIK: 910, membresia: 'premium', distrito: 'Tlalpan',             fechaRegistro: '2025-12-03' },
  { id: 'usr_006', nombres: 'María',    apellidos: 'García Flores',     dni: '78234567', estadoCertificacion: 'rechazado',      scorePIK: 210, membresia: 'free',    distrito: 'Iztacalco',           fechaRegistro: '2026-04-17' },
  { id: 'usr_007', nombres: 'Ricardo',  apellidos: 'Torres Guzmán',     dni: '62890123', estadoCertificacion: 'certificado',    scorePIK: 770, membresia: 'premium', distrito: 'Benito Juárez',       fechaRegistro: '2026-01-28' },
  { id: 'usr_008', nombres: 'Patricia', apellidos: 'Reyes Vega',        dni: '51234789', estadoCertificacion: 'en_proceso',     scorePIK: 490, membresia: 'free',    distrito: 'Venustiano Carranza', fechaRegistro: '2026-06-01' },
]

const ESTADOS = ['Todos', 'certificado', 'en_proceso', 'pendiente_pago', 'vencido', 'rechazado']

const ESTADO_SHORT = {
  certificado:    'Certif.',
  en_proceso:     'En proceso',
  pendiente_pago: 'Pend. pago',
  vencido:        'Vencido',
  rechazado:      'Rechazado',
}

// Enmascara los últimos 4 dígitos del DNI para privacidad
function maskDNI(dni) {
  return `••••${dni.slice(-4)}`
}

// Barra de score con color por rango
function ScoreBar({ score }) {
  const pct   = (score / 1000) * 100
  const color = score >= 700 ? 'bg-success' : score >= 450 ? 'bg-warning' : 'bg-danger'
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-slate-500">{score}</span>
    </div>
  )
}

// Fila de usuario en la tabla
function UserRow({ user }) {
  const [expanded, setExpanded] = useState(false)
  const initials = getIniciales(`${user.nombres} ${user.apellidos}`)

  return (
    <div
      className={cn(
        'rounded-xl bg-white px-3 py-3 shadow-card transition-all cursor-pointer',
        expanded && 'ring-1 ring-primary/20'
      )}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Fila principal */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
          {initials}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-semibold text-ink truncate">
              {user.nombres} {user.apellidos}
            </p>
            {user.membresia === 'premium' && (
              <Badge variant="primary" size="sm">PRO</Badge>
            )}
          </div>
          <p className="text-[11px] text-slate-400">{maskDNI(user.dni)} · {user.distrito}</p>
        </div>

        {/* Estado */}
        <StatusBadge estado={user.estadoCertificacion} size="sm" />
      </div>

      {/* Detalle expandido */}
      {expanded && (
        <div className="mt-3 space-y-2 border-t border-slate-50 pt-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Score PIK</span>
            <ScoreBar score={user.scorePIK} />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Registro</span>
            <span className="text-ink">{user.fechaRegistro}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">ID usuario</span>
            <span className="font-mono text-slate-400">{user.id}</span>
          </div>
          {/* Acciones mock */}
          <div className="flex gap-2 pt-1">
            <button className="flex-1 rounded-lg bg-primary/10 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20">
              Ver expediente
            </button>
            <button className="flex-1 rounded-lg bg-slate-100 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
              Enviar mensaje
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function VerificationsManage() {
  const [search,       setSearch]       = useState('')
  const [filterEstado, setFilterEstado] = useState('Todos')

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = search === '' ||
      `${u.nombres} ${u.apellidos}`.toLowerCase().includes(search.toLowerCase()) ||
      u.dni.includes(search)
    const matchEstado = filterEstado === 'Todos' || u.estadoCertificacion === filterEstado
    return matchSearch && matchEstado
  })

  const totalCertificados = MOCK_USERS.filter((u) => u.estadoCertificacion === 'certificado').length
  const totalEnProceso    = MOCK_USERS.filter((u) => u.estadoCertificacion === 'en_proceso').length

  return (
    <div className="space-y-4 p-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">Verificaciones</h2>
          <p className="text-[11px] text-slate-500">
            {totalCertificados} certificados · {totalEnProceso} en proceso
          </p>
        </div>
        <Badge variant="info">DEMO</Badge>
      </div>

      {/* Búsqueda */}
      <Input
        name="search"
        placeholder="Buscar por nombre o DNI…"
        leftIcon={<Search size={15} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filtros por estado (scroll horizontal) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {ESTADOS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setFilterEstado(e)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors',
              filterEstado === e
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            )}
          >
            {e === 'Todos' ? 'Todos' : (ESTADO_SHORT[e] ?? e)}
          </button>
        ))}
      </div>

      {/* Conteo */}
      <p className="text-[11px] text-slate-400">
        {filtered.length} {filtered.length === 1 ? 'usuario' : 'usuarios'} encontrados
      </p>

      {/* Lista de usuarios */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="rounded-xl bg-white py-10 text-center text-sm text-slate-400 shadow-card">
            Sin resultados para "{search}"
          </div>
        ) : (
          filtered.map((user) => <UserRow key={user.id} user={user} />)
        )}
      </div>

      {/* Nota de demo */}
      <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-center">
        <Badge variant="danger" size="sm">DEMO — Panel de Inteligencia de Negocio</Badge>
        <p className="mt-1 text-[10px] text-slate-400">
          Tracking de comportamiento y scraping automático se activan en producción.
        </p>
      </div>
    </div>
  )
}
