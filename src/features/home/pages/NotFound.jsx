import { useNavigate } from 'react-router-dom'
import { MapPinOff } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-slate-100">
        <MapPinOff size={38} className="text-slate-400" strokeWidth={1.4} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-ink">404</h2>
        <p className="mt-1 text-sm text-slate-500">Esta ruta no existe en el ecosistema PIK.</p>
      </div>
      <button
        onClick={() => navigate('/app')}
        className="mt-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-card"
      >
        Volver al Inicio
      </button>
    </div>
  )
}
