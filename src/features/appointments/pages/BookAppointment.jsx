import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, MapPin, Calendar, Clock } from 'lucide-react'
import { Card, Badge, Button, Stepper, Skeleton } from '@/components/ui'
import { useToast } from '@/hooks/useToast'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/context/AuthContext'
import { useSedes } from '../hooks/useSedes'
import { getDisponibilidad, getSede } from '@/services/sedesService'
import { crearCita } from '@/services/citasService'
import { listContainer, listItem } from '@/lib/motion'

const STEPS = [
  { key: 'sede',    label: 'Sede'      },
  { key: 'fecha',   label: 'Fecha'     },
  { key: 'resumen', label: 'Confirmar' },
]

const DIAS_FULL  = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const DIAS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES      = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MESES_FULL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

// Próximos N días hábiles desde mañana (excluye domingo)
function getNextBusinessDays(n = 7) {
  const days = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (days.length < n) {
    if (d.getDay() !== 0) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

// Formato local YYYY-MM-DD (evita off-by-one por desfase UTC)
function toISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const BUSINESS_DAYS = getNextBusinessDays(7)

export default function BookAppointment() {
  const navigate        = useNavigate()
  const { show }        = useToast()
  const { currentUser } = useAuth()

  const [step, setStep]             = useState(0)
  const [selectedSede, setSelectedSede] = useState(null)
  const [sedeDetail, setSedeDetail]     = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedHora, setSelectedHora] = useState(null)
  const [slots, setSlots]               = useState(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [confirming, setConfirming]     = useState(false)

  const { sedes, loading: sedesLoading } = useSedes({ activa: true })

  // Refrescar slots al cambiar fecha o sede
  useEffect(() => {
    if (!selectedSede || !selectedDate) return
    setSlotsLoading(true)
    setSlots(null)
    setSelectedHora(null)
    getDisponibilidad(selectedSede.id, selectedDate).then((data) => {
      setSlots(data)
      setSlotsLoading(false)
    })
  }, [selectedSede, selectedDate])

  // Detalle de sede para el resumen (dirección completa)
  useEffect(() => {
    if (!selectedSede) return
    getSede(selectedSede.id).then(setSedeDetail)
  }, [selectedSede])

  async function handleConfirm() {
    setConfirming(true)
    try {
      await crearCita({
        usuarioId:   currentUser.id,
        sedeId:      selectedSede.id,
        fecha:       selectedDate,
        hora:        selectedHora,
        tipo:        'verificacion_inicial',
        duracionMin: 45,
        costo:       85,
        notas:       'Traer documentos en original y copia.',
      })
      show({
        title:       '¡Cita agendada!',
        description: `${selectedDate} · ${selectedHora} en ${selectedSede.nombre}`,
        variant:     'success',
      })
      navigate(ROUTES.APPOINTMENTS)
    } finally {
      setConfirming(false)
    }
  }

  // ── Paso 0: Selección de sede ─────────────────────────────────────────
  function renderStepSede() {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">
          Elige la sede donde deseas realizar tu verificación PIK.
        </p>
        <Badge variant="info">DEMO — datos de muestra</Badge>

        {sedesLoading ? (
          <div className="space-y-3 pt-2">
            <Skeleton height={80} className="w-full" />
            <Skeleton height={80} className="w-full" />
          </div>
        ) : (
          <motion.div
            variants={listContainer}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {sedes.map((sede) => (
              <motion.div key={sede.id} variants={listItem}>
                <Card
                  variant="interactive"
                  padding="md"
                  onClick={() => {
                    setSelectedSede(sede)
                    setSelectedDate(null)
                    setSelectedHora(null)
                    setSlots(null)
                    setStep(1)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{sede.nombre}</p>
                      <p className="truncate text-xs text-slate-500">{sede.direccion}</p>
                      <p className="text-[11px] text-slate-400">{sede.distrito} · {sede.horario?.lunesViernes}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    )
  }

  // ── Paso 1: Fecha + hora ──────────────────────────────────────────────
  function renderStepFecha() {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Selecciona una fecha disponible en{' '}
          <span className="font-semibold text-ink">{selectedSede?.nombre}</span>.
        </p>
        <Badge variant="info">DEMO</Badge>

        {/* Chips de fecha */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Calendar size={13} /> Fecha
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {BUSINESS_DAYS.map((date) => {
              const iso    = toISO(date)
              const active = selectedDate === iso
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(iso)}
                  className={`flex shrink-0 flex-col items-center rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{DIAS_SHORT[date.getDay()]}</span>
                  <span className="text-base font-bold">{date.getDate()}</span>
                  <span>{MESES[date.getMonth()]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Slots de hora */}
        {selectedDate && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Clock size={13} /> Horario disponible
            </p>
            {slotsLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} height={36} />)}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots?.map((slot) => {
                  const active = selectedHora === slot.hora
                  return (
                    <button
                      key={slot.hora}
                      type="button"
                      disabled={!slot.disponible}
                      onClick={() => setSelectedHora(slot.hora)}
                      className={`rounded-xl py-2 text-sm font-semibold transition-colors ${
                        !slot.disponible
                          ? 'cursor-not-allowed bg-slate-50 text-slate-300'
                          : active
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {slot.hora}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="md" onClick={() => setStep(0)} className="shrink-0">
            Atrás
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!selectedDate || !selectedHora}
            onClick={() => setStep(2)}
            className="flex-1"
          >
            Siguiente
          </Button>
        </div>
      </div>
    )
  }

  // ── Paso 2: Resumen + confirmación ────────────────────────────────────
  function renderStepResumen() {
    // Parseamos con offset neutro para no depender de TZ del navegador
    const dateObj   = selectedDate ? new Date(selectedDate + 'T12:00:00') : null
    const dateLabel = dateObj
      ? `${DIAS_FULL[dateObj.getDay()]} ${dateObj.getDate()} de ${MESES_FULL[dateObj.getMonth()]}`
      : '—'

    return (
      <div className="space-y-4">
        <Badge variant="info">DEMO — la cita se simula, no se registra en servidor</Badge>

        <Card variant="outlined" padding="md" className="space-y-3">
          {[
            { label: 'Sede',      value: sedeDetail?.nombre ?? selectedSede?.nombre },
            { label: 'Dirección', value: sedeDetail?.direccion ?? '—' },
            { label: 'Fecha',     value: dateLabel },
            { label: 'Hora',      value: selectedHora },
            { label: 'Tipo',      value: 'Verificación inicial' },
            { label: 'Duración',  value: '45 minutos' },
            { label: 'Costo',     value: 'S/ 85.00' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 text-sm">
              <span className="shrink-0 text-slate-500">{label}</span>
              <span className="text-right font-semibold text-ink">{value}</span>
            </div>
          ))}
        </Card>

        <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
          Recuerda traer <strong>INE, licencia de conducir y seguro vehicular vigente</strong> en original y copia.
        </p>

        <div className="flex gap-3">
          <Button variant="outline" size="md" onClick={() => setStep(1)} className="shrink-0">
            Atrás
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={confirming}
            leftIcon={<CheckCircle size={16} />}
            onClick={handleConfirm}
            className="flex-1"
          >
            Confirmar cita
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 pb-28 pt-4">
      <Stepper steps={STEPS} current={step} />
      {step === 0 && renderStepSede()}
      {step === 1 && renderStepFecha()}
      {step === 2 && renderStepResumen()}
    </div>
  )
}
