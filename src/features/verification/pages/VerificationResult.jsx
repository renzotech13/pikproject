import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, IdCard, Home, CheckCircle2 } from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/routes'

const CHECKS = [
  'Identidad validada con Lista Nominal (INE)',
  'Licencia tipo A vigente — Semovi',
  'Vehículo sin reporte — Repuve',
  'Antecedentes de tránsito limpios',
]

export default function VerificationResult() {
  const navigate        = useNavigate()
  const { currentUser } = useAuth()
  const score = currentUser?.scorePIK ?? 820

  return (
    <div className="space-y-5 px-4 pb-28 pt-6">

      {/* Hero de éxito */}
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-success/10"
        >
          <ShieldCheck size={40} className="text-success" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-1"
        >
          <h2 className="text-xl font-black text-ink">Identidad verificada</h2>
          <p className="text-sm text-slate-500">
            Nivel de verificación <span className="font-bold text-ink">3 de 3</span> alcanzado.
          </p>
        </motion.div>
        <Badge variant="info">DEMO</Badge>
      </div>

      {/* Score PIK */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card variant="outlined" padding="md">
          <div className="mb-1.5 flex items-baseline justify-between">
            <p className="text-sm font-semibold text-ink">Score PIK</p>
            <p className="text-2xl font-black text-primary">{score}<span className="text-sm font-semibold text-slate-400"> / 1000</span></p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / 1000) * 100}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="h-2 rounded-full bg-primary"
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Calculado con base en documentos, historial y antecedentes de tránsito.
          </p>
        </Card>
      </motion.div>

      {/* Validaciones */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Card variant="outlined" padding="md" className="space-y-2.5">
          {CHECKS.map((c) => (
            <div key={c} className="flex items-center gap-2.5 text-sm text-slate-600">
              <CheckCircle2 size={16} className="shrink-0 text-success" />
              {c}
            </div>
          ))}
        </Card>
      </motion.div>

      {/* Acciones */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<IdCard size={17} />}
          onClick={() => navigate(ROUTES.CREDENTIAL)}
        >
          Ver mi credencial digital
        </Button>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          leftIcon={<Home size={17} />}
          onClick={() => navigate(ROUTES.APP)}
        >
          Volver al inicio
        </Button>
      </motion.div>
    </div>
  )
}
