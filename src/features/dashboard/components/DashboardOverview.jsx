import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, ShieldCheck, DollarSign, Percent, Calendar, Info } from 'lucide-react'
import { Badge } from '@/components/ui'
import { formatMXN, formatNumber } from '@/lib/formatters'
import ProjectStatus from './ProjectStatus'
import { listContainer, listItem } from '@/lib/motion'

// ── Datos estáticos para los gráficos (analytics.json + sedes mock extra) ──

const KPIS = [
  {
    label:  'Usuarios certificados',
    value:  8932,
    fmt:    'numero',
    change: '+12.4%',
    up:     true,
    icon:   ShieldCheck,
    color:  'bg-success/10 text-success',
  },
  {
    label:  'Ingresos del mes',
    value:  542300,
    fmt:    'moneda',
    change: '+8.3%',
    up:     true,
    icon:   DollarSign,
    color:  'bg-purple-100 text-purple-600',
  },
  {
    label:  'Tasa de certificación',
    value:  71.6,
    fmt:    'pct',
    change: '+2.1%',
    up:     true,
    icon:   Percent,
    color:  'bg-primary/10 text-primary',
  },
  {
    label:  'Citas hoy',
    value:  156,
    fmt:    'numero',
    change: '-4.0%',
    up:     false,
    icon:   Calendar,
    color:  'bg-amber-100 text-amber-600',
  },
]

// 5 sedes (2 reales + 3 expandidas para gráfico más visual)
const CITAS_POR_SEDE = [
  { nombre: 'Cuauhtémoc',        cantidad: 1820 },
  { nombre: 'G.A. Madero',       cantidad: 1140 },
  { nombre: 'Coyoacán',          cantidad: 978  },
  { nombre: 'Iztapalapa',        cantidad: 756  },
  { nombre: 'Tlalpan',           cantidad: 534  },
]

const INGRESOS_POR_MES = [
  { mes: 'Ene', monto: 380000 },
  { mes: 'Feb', monto: 412000 },
  { mes: 'Mar', monto: 455000 },
  { mes: 'Abr', monto: 489000 },
  { mes: 'May', monto: 512000 },
  { mes: 'Jun', monto: 542300 },
]

const BY_STATE = [
  { label: 'Certificados',    value: 8932, color: 'bg-success', pct: 71.6 },
  { label: 'En proceso',      value: 1203, color: 'bg-warning', pct: 9.6  },
  { label: 'Vencidos',        value: 980,  color: 'bg-danger',  pct: 7.9  },
  { label: 'Pendiente pago',  value: 640,  color: 'bg-info',    pct: 5.1  },
]

// ── Colores degradados para barras ────────────────────────────────────────
const BAR_COLORS = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE']

// ── Formateo compacto para ejes Y ─────────────────────────────────────────
function fmtKMXN(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (val >= 1000)    return `$${(val / 1000).toFixed(0)}K`
  return `$${val}`
}

// ── Tooltips personalizados — el "momento wow" del cliente ─────────────────

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-float">
      <p className="text-[11px] font-semibold text-slate-500">Sede</p>
      <p className="text-sm font-bold text-ink">{label}</p>
      <p className="mt-1 text-lg font-black text-primary">{formatNumber(payload[0].value)}</p>
      <p className="text-[10px] text-slate-400">citas registradas</p>
    </div>
  )
}

function AreaTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-float">
      <p className="text-[11px] font-semibold text-slate-500">{label} 2026</p>
      <p className="mt-0.5 text-lg font-black text-primary">{formatMXN(payload[0].value)}</p>
      <p className="text-[10px] text-slate-400">ingresos acumulados</p>
    </div>
  )
}

// ── KpiCard ───────────────────────────────────────────────────────────────

function KpiCard({ label, value, fmt, change, up, icon: Icon, color }) {
  const display =
    fmt === 'moneda'  ? formatMXN(value)
    : fmt === 'pct'   ? `${value}%`
    :                   formatNumber(value)

  return (
    <div className="rounded-xl bg-white p-4 shadow-card">
      <div className={`mb-2.5 grid h-9 w-9 place-items-center rounded-xl ${color}`}>
        <Icon size={17} />
      </div>
      <p className="text-[11px] leading-tight text-slate-500">{label}</p>
      <p className="mt-0.5 text-[15px] font-bold text-ink">{display}</p>
      <div className={`mt-1 flex items-center gap-1 text-[10px] font-semibold ${up ? 'text-success' : 'text-danger'}`}>
        {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {change} vs mes anterior
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────

export default function DashboardOverview() {
  const [roadmapOpen, setRoadmapOpen] = useState(false)

  return (
    <div className="space-y-4 p-4">

      {/* Encabezado */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-ink">Panel de Inteligencia de Negocio</h2>
          <p className="text-[11px] text-slate-500">Resumen operacional · Junio 2026</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Botón de roadmap — abre el ProjectStatus drawer */}
          <button
            onClick={() => setRoadmapOpen(true)}
            title="Ver Roadmap del proyecto"
            className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-primary"
          >
            <Info size={14} />
          </button>
          <Badge variant="danger">DEMO</Badge>
        </div>
      </div>

      {/* KPIs 2×2 */}
      <motion.div
        variants={listContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        {KPIS.map((kpi) => (
          <motion.div key={kpi.label} variants={listItem}>
            <KpiCard {...kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* BarChart — Citas por Sede */}
      <div className="rounded-xl bg-white p-4 shadow-card">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Citas por Sede</p>
          <span className="text-[10px] text-slate-400">Total · 2026</span>
        </div>
        <p className="mb-3 text-[10px] text-slate-400">Pasa el cursor sobre las barras para ver el detalle</p>

        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={CITAS_POR_SEDE} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="nombre"
              tick={{ fontSize: 9, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<BarTooltip />}
              cursor={{ fill: '#F8FAFC', radius: 4 }}
            />
            <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {CITAS_POR_SEDE.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i] ?? '#C7D2FE'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AreaChart — Ingresos por Mes */}
      <div className="rounded-xl bg-white p-4 shadow-card">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Ingresos por Mes</p>
          <span className="text-[10px] text-slate-400">MXN · 2026</span>
        </div>
        <p className="mb-3 text-[10px] text-slate-400">Tendencia de ingresos acumulados</p>

        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={INGRESOS_POR_MES} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="ingresoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 9, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmtKMXN}
              tick={{ fontSize: 9, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<AreaTooltip />}
              cursor={{ stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="monto"
              stroke="#4F46E5"
              strokeWidth={2}
              fill="url(#ingresoGrad)"
              dot={{ r: 3, fill: '#4F46E5', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#4F46E5', stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Distribución por estado */}
      <div className="rounded-xl bg-white p-4 shadow-card">
        <p className="mb-3 text-sm font-semibold text-ink">Distribución por Estado</p>
        <div className="space-y-3">
          {BY_STATE.map(({ label, value, color, pct }) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-600">{label}</span>
                <span className="font-semibold text-ink">{formatNumber(value)} ({pct}%)</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-1.5 rounded-full ${color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasa de certificación — hero */}
      <div className="rounded-xl bg-gradient-to-br from-primary to-indigo-700 p-4 text-white shadow-card">
        <p className="text-[11px] font-semibold text-white/70">Tasa de certificación global</p>
        <p className="mt-1 text-4xl font-black">71.6%</p>
        <p className="mt-0.5 text-[11px] text-white/60">
          8,932 de 12,480 motociclistas registrados
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-2 w-[71.6%] rounded-full bg-white transition-all duration-1000" />
        </div>
        <p className="mt-2 text-[10px] text-white/40">
          Meta 2026: 80% · Avance: ████████░░ 71.6%
        </p>
      </div>

      {/* Nota de demo */}
      <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
        <Badge variant="danger" className="mb-1.5">DEMO — Panel de Inteligencia de Negocio</Badge>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Tracking de comportamiento y scraping automático (SICT · Semovi · SAT)
          se activan en producción.{' '}
          <button
            onClick={() => setRoadmapOpen(true)}
            className="font-semibold text-primary underline decoration-dotted underline-offset-2"
          >
            Ver roadmap →
          </button>
        </p>
      </div>

      {/* Drawer de Roadmap (ProjectStatus) */}
      <ProjectStatus isOpen={roadmapOpen} onClose={() => setRoadmapOpen(false)} />
    </div>
  )
}
