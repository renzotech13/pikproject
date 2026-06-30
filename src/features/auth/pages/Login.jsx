import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-2xl font-extrabold text-white shadow-float">
          PIK
        </div>
        <h1 className="text-xl font-semibold text-ink">Iniciar Sesión</h1>
        <p className="mt-1 text-sm text-slate-500">Ecosistema de Certificación de Motociclistas</p>
      </div>

      {/* Acceso demo */}
      <div className="mb-5 w-full rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">Modo Demo</p>
        <button
          onClick={() => navigate('/app')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-card transition-colors hover:bg-primary-700"
        >
          <Zap size={16} />
          Ingresar como motociclista demo
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
        >
          Ingresar como administrador demo
        </button>
      </div>

      {/* Formulario real (placeholder) */}
      <div className="w-full space-y-3 opacity-40 pointer-events-none select-none">
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
          placeholder="Email o DNI"
          readOnly
        />
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
          placeholder="Contraseña"
          type="password"
          readOnly
        />
        <button className="w-full rounded-xl bg-slate-200 py-3 text-sm font-semibold text-slate-400">
          Iniciar sesión
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">
        Autenticación real con JWT pendiente de integración.
      </p>
    </div>
  )
}
