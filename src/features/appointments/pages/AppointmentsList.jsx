import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Plus } from 'lucide-react'
import { listContainer, listItem } from '@/lib/motion'
import { Button, Badge, EmptyState, Skeleton } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { useAppointments } from '../hooks/useAppointments'
import { useSedes } from '../hooks/useSedes'
import AppointmentCard from '../components/AppointmentCard'

function localToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const TODAY = localToday()

export default function AppointmentsList() {
  const navigate = useNavigate()
  const { citas, loading } = useAppointments()
  const { sedes }          = useSedes({ activa: true })

  const sedeMap   = Object.fromEntries(sedes.map((s) => [s.id, s.nombre]))
  const proximas  = citas.filter((c) => c.fecha >= TODAY && c.estado !== 'cancelada')
  const historial = citas.filter((c) => c.fecha < TODAY  || c.estado === 'cancelada')

  return (
    <div className="space-y-5 px-4 pb-28 pt-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Mis Citas</h2>
        <Badge variant="info">DEMO</Badge>
      </div>

      {/* Estado carga */}
      {loading && (
        <div className="space-y-3">
          <Skeleton height={88} className="w-full" />
          <Skeleton height={88} className="w-full" />
        </div>
      )}

      {/* Sin citas */}
      {!loading && citas.length === 0 && (
        <EmptyState
          Icon={Calendar}
          title="Sin citas agendadas"
          description="Agenda tu primera cita de certificación PIK para comenzar el proceso."
          action={
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => navigate(ROUTES.BOOK_APPOINTMENT)}
            >
              Agendar cita
            </Button>
          }
        />
      )}

      {/* Lista */}
      {!loading && citas.length > 0 && (
        <>
          {proximas.length > 0 && (
            <section className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Próximas ({proximas.length})
              </p>
              <motion.div
                variants={listContainer}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {proximas.map((c) => (
                  <motion.div key={c.id} variants={listItem}>
                    <AppointmentCard
                      cita={c}
                      sedeNombre={sedeMap[c.sedeId]}
                      onClick={() => navigate(ROUTES.APPOINTMENT_DETAIL(c.id))}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {historial.length > 0 && (
            <section className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Historial ({historial.length})
              </p>
              <motion.div
                variants={listContainer}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {historial.map((c) => (
                  <motion.div key={c.id} variants={listItem}>
                    <AppointmentCard
                      cita={c}
                      sedeNombre={sedeMap[c.sedeId]}
                      onClick={() => navigate(ROUTES.APPOINTMENT_DETAIL(c.id))}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Plus size={18} />}
            onClick={() => navigate(ROUTES.BOOK_APPOINTMENT)}
          >
            Agendar nueva cita
          </Button>
        </>
      )}
    </div>
  )
}
