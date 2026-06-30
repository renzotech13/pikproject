import { NavLink, useLocation } from 'react-router-dom'
import { Home, Calendar, Gift, User } from 'lucide-react'
import { cn } from '@/lib/cn'

const TABS = [
  { to: '/app', icon: Home, label: 'Inicio', exact: true },
  { to: '/app/citas', icon: Calendar, label: 'Citas' },
  { to: '/app/beneficios', icon: Gift, label: 'Beneficios' },
  { to: '/app/perfil', icon: User, label: 'Perfil' },
]

export default function BottomNav() {
  const location = useLocation()

  function isActive({ to, exact }) {
    return exact ? location.pathname === to : location.pathname.startsWith(to)
  }

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-full max-w-app -translate-x-1/2 px-6">
      <div className="mx-auto flex max-w-[320px] items-center justify-between rounded-2xl bg-white px-2 py-2 shadow-float">
        {TABS.map((tab) => {
          const active = isActive(tab)
          const { icon: Icon, label, to } = tab
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 transition-colors',
                active ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
