import { useNavigate, useMatches, useLocation } from 'react-router-dom'
import { ChevronLeft, Settings } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

// Rutas que son "raíces" de tab → no muestran botón Atrás
const NAV_ROOTS = new Set(['/app', '/app/citas', '/app/beneficios', '/app/perfil'])

export default function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const matches = useMatches()
  const { switchDemoUser } = useAuth()

  // Toma el título de la ruta más profunda que tenga handle.title
  const title = [...matches].reverse().find((m) => m.handle?.title)?.handle?.title ?? 'PIK'
  const showBack = !NAV_ROOTS.has(location.pathname)

  function handleAdminSwitch() {
    switchDemoUser('admin')
    navigate('/admin')
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur-md">
      {/* Izquierda: atrás o logotipo */}
      <div className="w-20">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-0.5 text-sm font-medium text-slate-500 transition-colors hover:text-ink"
          >
            <ChevronLeft size={18} />
            Atrás
          </button>
        ) : (
          <span className="text-xl font-extrabold tracking-tight text-primary">PIK</span>
        )}
      </div>

      {/* Centro: título de la pantalla */}
      <h1 className="text-sm font-semibold text-ink">{title}</h1>

      {/* Derecha: toggle de demo */}
      <div className="flex w-20 justify-end">
        <button
          onClick={handleAdminSwitch}
          title="Cambiar a Vista Admin (demo)"
          className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition-all hover:bg-primary hover:text-white"
        >
          <Settings size={11} />
          Admin
        </button>
      </div>
    </header>
  )
}
