import { AnimatePresence, motion } from 'framer-motion'
import {
  X, CheckCircle2, Zap, ShieldCheck, Calendar, CreditCard,
  Table2, Palette, LayoutDashboard, GitBranch,
  Building2, Bell, Globe, MapPin, BarChart2, Smartphone, Database,
} from 'lucide-react'
import { Badge } from '@/components/ui'

// ── Módulos Operativos (MVP) — lo que el cliente VE funcionando hoy ────────

const MVP = [
  {
    icon: LayoutDashboard,
    name: 'Dashboard Admin',
    desc: 'KPIs en tiempo real, BarChart (Citas por Sede), AreaChart (Ingresos MXN) con tooltips interactivos.',
  },
  {
    icon: Calendar,
    name: 'Gestión de Citas',
    desc: 'Stepper 3 pasos, slots dinámicos de disponibilidad, confirmación con toast y persistencia en sesión.',
  },
  {
    icon: CreditCard,
    name: 'Pasarela de Pagos',
    desc: 'Tarjeta con validación Luhn, WebView simulado de Mercado Pago, SPEI con CLABE y botón de copia.',
  },
  {
    icon: ShieldCheck,
    name: 'Panel de Verificaciones',
    desc: 'Tabla con búsqueda live, filtros por estado, filas expandibles y barra de Score PIK.',
  },
  {
    icon: Table2,
    name: 'Servicios Mock (API Layer)',
    desc: 'citasService, pagosService, sedesService — _store en memoria, mockFetch con latencia configurable.',
  },
  {
    icon: Palette,
    name: 'Sistema de Diseño',
    desc: 'Button, Card, Badge, StatusBadge, Input, Stepper, Skeleton, EmptyState — todos con cn() + Tailwind.',
  },
  {
    icon: GitBranch,
    name: 'Arquitectura Feature-Sliced',
    desc: 'src/features/{nombre}/{components,hooks,pages,index.js} — escalable a equipo multi-desarrollador.',
  },
  {
    icon: CheckCircle2,
    name: 'Navegación Completa',
    desc: 'AppShell, BottomNav flotante, TopBar con breadcrumb dinámico, page transitions con Framer Motion.',
  },
]

// ── Módulos en Desarrollo (Producción) — próxima fase ─────────────────────

const PROD = [
  {
    icon: Zap,
    name: 'APIs Oficiales MTC / SUTRAN',
    desc: 'Validación de licencias, registros vehiculares y antecedentes en tiempo real.',
  },
  {
    icon: CreditCard,
    name: 'Mercado Pago Certificado',
    desc: 'Checkout PCI DSS real, webhooks de confirmación, conciliación automática.',
  },
  {
    icon: Building2,
    name: 'SPEI Automático (STP)',
    desc: 'Integración con STP/Banxico para acreditación instantánea y conciliación.',
  },
  {
    icon: Globe,
    name: 'Scraping Automatizado',
    desc: 'Bot de sincronización con registros MTC · SUTRAN · SOAT · Placas vehiculares.',
  },
  {
    icon: Bell,
    name: 'Notificaciones Push',
    desc: 'Firebase Cloud Messaging + OneSignal para alertas de vencimiento y citas.',
  },
  {
    icon: MapPin,
    name: 'Geolocalización en Tiempo Real',
    desc: 'Google Maps Platform, sedes más cercanas, cálculo de rutas.',
  },
  {
    icon: BarChart2,
    name: 'Reportes Multi-sede',
    desc: 'Exportación PDF/Excel, reportes programados, analytics de comportamiento.',
  },
  {
    icon: Smartphone,
    name: 'App Nativa (iOS / Android)',
    desc: 'React Native + Expo — mismo codebase, build pipeline CI/CD, push nativo.',
  },
]

// ── Stack técnico ─────────────────────────────────────────────────────────

const STACK = [
  'React 18 + Vite', 'Tailwind CSS', 'Framer Motion',
  'Recharts', 'React Router v6', 'Lucide Icons',
  'Ready: Supabase / PostgreSQL', 'Ready: Edge Functions',
]

// ── Módulo item ───────────────────────────────────────────────────────────

function ModuleItem({ icon: Icon, name, desc, type }) {
  const isMvp = type === 'mvp'
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
        isMvp ? 'bg-success/10' : 'bg-sky-100'
      }`}>
        <Icon size={15} className={isMvp ? 'text-success' : 'text-sky-600'} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-sm font-semibold text-ink">{name}</p>
          <Badge variant={isMvp ? 'success' : 'info'} size="sm">
            {isMvp ? '✓ Activo' : 'Próximo'}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{desc}</p>
      </div>
    </div>
  )
}

// ── Componente principal (Bottom Drawer) ──────────────────────────────────
// Props: isOpen (bool), onClose (fn)

export default function ProjectStatus({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Drawer — sube desde el borde inferior */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-3xl bg-white"
            style={{ maxWidth: '480px', margin: '0 auto' }}
          >
            {/* Handle pill */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-slate-200" />
            </div>

            {/* Header fijo */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <div>
                <h3 className="text-base font-bold text-ink">Roadmap del Proyecto</h3>
                <p className="text-[11px] text-slate-400">PIK · v1.0 Demo → v1.1 Producción</p>
              </div>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4">

              {/* Intro badge */}
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="success">MVP Operativo</Badge>
                <span className="text-[11px] text-slate-400">{MVP.length} módulos activos</span>
              </div>

              {/* Sección 1: MVP */}
              <div className="divide-y divide-slate-50">
                {MVP.map((m) => <ModuleItem key={m.name} {...m} type="mvp" />)}
              </div>

              {/* Divisor de fase */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100" />
                <div className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1">
                  <Database size={11} className="text-sky-500" />
                  <span className="text-[11px] font-semibold text-sky-600">
                    Próximas integraciones de producción
                  </span>
                </div>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              {/* Sección 2: Producción */}
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="info">En Desarrollo</Badge>
                <span className="text-[11px] text-slate-400">{PROD.length} módulos planificados</span>
              </div>

              <div className="divide-y divide-slate-50">
                {PROD.map((m) => <ModuleItem key={m.name} {...m} type="prod" />)}
              </div>

              {/* Stack técnico */}
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Stack tecnológico
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STACK.map((s) => (
                    <span
                      key={s}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        s.startsWith('Ready')
                          ? 'bg-primary/10 text-primary'
                          : 'bg-white text-slate-600 shadow-sm'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mensaje de cierre */}
              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-400 italic">
                "Este demo refleja la arquitectura base y la lógica de negocio central.
                Las integraciones de alta latencia y los endpoints de servidores externos
                se activarán en el despliegue a producción."
              </p>

              <div className="mt-3 text-center">
                <Badge variant="danger" size="sm">DEMO — Panel de Inteligencia de Negocio</Badge>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
