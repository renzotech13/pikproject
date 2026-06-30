import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion'
import {
  LayoutDashboard, ShieldCheck, Calendar, MapPin,
  Users, BookOpen, Handshake, Bike, RefreshCw, Loader2, CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'

const ADMIN_NAV = [
  { to: '/admin',                  icon: LayoutDashboard, label: 'Dashboard',      exact: true },
  { to: '/admin/verificaciones',   icon: ShieldCheck,     label: 'Verificaciones'              },
  { to: '/admin/citas',            icon: Calendar,        label: 'Citas'                       },
  { to: '/admin/sedes',            icon: MapPin,          label: 'Sedes'                       },
  { to: '/admin/aliados',          icon: Handshake,       label: 'Aliados'                     },
  { to: '/admin/regulaciones',     icon: BookOpen,        label: 'Regulaciones'                },
  { to: '/admin/usuarios',         icon: Users,           label: 'Usuarios'                    },
]

// Fuentes de datos externas simuladas — el "pitch" de scraping
const FUENTES = 'SICT · Semovi · SAT · Repuve'

export default function AdminLayout() {
  const { switchDemoUser } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [refreshPhase, setRefreshPhase] = useState('idle') // 'idle' | 'scraping' | 'done'

  function goToRider() {
    switchDemoUser('motociclista')
    navigate('/app')
  }

  function handleRefresh() {
    if (refreshPhase !== 'idle') return
    setRefreshPhase('scraping')
    setTimeout(() => {
      setRefreshPhase('done')
      setTimeout(() => setRefreshPhase('idle'), 3500)
    }, 2000)
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col bg-surface">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">

        {/* Fila 1: Marca + Vista Rider */}
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/20 text-xs font-bold">A</div>
            <span className="text-sm font-semibold">PIK · Admin</span>
          </div>
          <button
            onClick={goToRider}
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/30"
          >
            <Bike size={12} />
            Vista Rider
          </button>
        </div>

        {/* Fila 2: Fuentes de datos + botón Refrescar (scraping simulation) */}
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-1.5">
          <p className="text-[10px] text-white/50 truncate pr-2">
            {refreshPhase === 'done'
              ? '✓ Datos sincronizados con fuentes externas'
              : `Fuentes: ${FUENTES}`}
          </p>

          <button
            onClick={handleRefresh}
            disabled={refreshPhase === 'scraping'}
            className={cn(
              'flex shrink-0 items-center gap-1 text-[11px] font-semibold transition-colors',
              refreshPhase === 'scraping' ? 'text-white/50' : 'text-white/80 hover:text-white',
              refreshPhase === 'done'     && 'text-emerald-300'
            )}
          >
            {refreshPhase === 'scraping' && (
              <><Loader2 size={11} className="animate-spin" /> Scraping…</>
            )}
            {refreshPhase === 'done' && (
              <><CheckCircle2 size={11} /> Actualizado</>
            )}
            {refreshPhase === 'idle' && (
              <><RefreshCw size={11} /> Actualizar</>
            )}
          </button>
        </div>
      </header>

      {/* ── Tabs de navegación (scroll horizontal) ── */}
      <nav className="flex gap-1 overflow-x-auto bg-white px-3 py-2 shadow-sm">
        {ADMIN_NAV.map(({ to, icon: Icon, label, exact }) => {
          const active = exact ? location.pathname === to : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                active ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-100'
              )}
            >
              <Icon size={14} />
              {label}
            </NavLink>
          )
        })}
      </nav>

      {/* ── Contenido animado ── */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="flex-1 pb-8"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
