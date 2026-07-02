import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanLine, CheckCircle2, User, Loader2, ShieldCheck, ChevronRight } from 'lucide-react'
import { Card, Badge, Button, Stepper } from '@/components/ui'
import { ROUTES } from '@/constants/routes'

const STEPS = [
  { key: 'documento', label: 'Documento' },
  { key: 'datos',     label: 'Datos'     },
  { key: 'resultado', label: 'Resultado' },
]

// Datos que el "OCR" extrae de la INE de muestra
const CAMPOS_OCR = [
  { label: 'Nombre',           value: 'CARLOS RAMÍREZ HERRERA' },
  { label: 'CURP',             value: 'RAHC950312HDFMRR08' },
  { label: 'Clave de elector', value: 'RMHRCR95031209H400' },
  { label: 'Sección',          value: '0472' },
  { label: 'Vigencia',         value: '2033' },
]

// Validaciones contra fuentes externas (simuladas)
const VALIDACIONES = [
  { fuente: 'Lista Nominal · INE',       detalle: 'Identidad confirmada' },
  { fuente: 'Repuve',                    detalle: 'Vehículo sin reporte de robo' },
  { fuente: 'Semovi · Licencia tipo A',  detalle: 'Licencia vigente hasta 2028' },
]

const MENSAJES_SCAN = [
  'Detectando documento…',
  'Extrayendo campos (OCR)…',
  'Validando con fuentes oficiales…',
]

// Valor que se "tipea" solo, como si el OCR lo fuera llenando
function TypedValue({ text, active }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    const iv = setInterval(() => {
      setN((v) => {
        if (v >= text.length) { clearInterval(iv); return v }
        return v + 1
      })
    }, 26)
    return () => clearInterval(iv)
  }, [active, text])
  if (!active) return <span className="text-slate-300">···</span>
  return (
    <span className="font-mono text-[13px] font-semibold text-ink">
      {text.slice(0, n)}
      {n < text.length && <span className="animate-pulse text-primary">▍</span>}
    </span>
  )
}

// Credencial INE de muestra dibujada con CSS — objetivo del escaneo
function IneMock({ scanning }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-3 shadow-card">
      {/* Franja institucional */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black tracking-wide text-slate-700">INSTITUTO NACIONAL ELECTORAL</p>
          <p className="text-[8px] font-semibold text-slate-400">MÉXICO · CREDENCIAL PARA VOTAR</p>
        </div>
        <div className="flex gap-0.5">
          <span className="h-3 w-1.5 rounded-sm bg-emerald-600" />
          <span className="h-3 w-1.5 rounded-sm bg-white ring-1 ring-slate-200" />
          <span className="h-3 w-1.5 rounded-sm bg-red-600" />
        </div>
      </div>

      <div className="flex gap-3">
        {/* Foto */}
        <div className="grid h-16 w-14 shrink-0 place-items-center rounded-md bg-slate-200">
          <User size={26} className="text-slate-400" />
        </div>
        {/* Datos */}
        <div className="min-w-0 flex-1 space-y-1">
          <div>
            <p className="text-[7px] font-bold text-slate-400">NOMBRE</p>
            <p className="text-[10px] font-bold leading-tight text-slate-700">RAMÍREZ<br />HERRERA<br />CARLOS</p>
          </div>
          <div>
            <p className="text-[7px] font-bold text-slate-400">DOMICILIO</p>
            <div className="mt-0.5 space-y-0.5">
              <div className="h-1 w-4/5 rounded bg-slate-200" />
              <div className="h-1 w-3/5 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-between font-mono text-[7px] text-slate-400">
        <span>CURP RAHC950312HDFMRR08</span>
        <span>VIGENCIA 2033</span>
      </div>

      {/* Overlay de escaneo */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/5"
          >
            {/* Esquinas de encuadre */}
            {['top-1 left-1 border-t-2 border-l-2', 'top-1 right-1 border-t-2 border-r-2',
              'bottom-1 left-1 border-b-2 border-l-2', 'bottom-1 right-1 border-b-2 border-r-2'
            ].map((pos) => (
              <span key={pos} className={`absolute h-4 w-4 rounded-sm border-primary ${pos}`} />
            ))}
            {/* Línea de barrido */}
            <motion.div
              initial={{ top: '4%' }}
              animate={{ top: '92%' }}
              transition={{ duration: 1.1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              className="absolute inset-x-2 h-0.5 rounded-full bg-primary shadow-[0_0_12px_2px_rgba(79,70,229,0.6)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function VerificationFlow() {
  const navigate = useNavigate()

  // fase: idle → scanning → extracted
  const [fase, setFase]               = useState('idle')
  const [msgIndex, setMsgIndex]       = useState(0)
  const [revelados, setRevelados]     = useState(0)   // campos OCR visibles
  const [validaciones, setValidaciones] = useState(0) // fuentes validadas visibles

  function iniciarEscaneo() {
    setFase('scanning')
    setMsgIndex(0)
    setTimeout(() => setMsgIndex(1), 900)
    setTimeout(() => setMsgIndex(2), 1800)
    setTimeout(() => setFase('extracted'), 2700)
  }

  // Revela los campos OCR uno a uno, luego las validaciones externas
  useEffect(() => {
    if (fase !== 'extracted') return
    const iv = setInterval(() => {
      setRevelados((v) => {
        if (v >= CAMPOS_OCR.length) { clearInterval(iv); return v }
        return v + 1
      })
    }, 480)
    return () => clearInterval(iv)
  }, [fase])

  useEffect(() => {
    if (revelados < CAMPOS_OCR.length) return
    const iv = setInterval(() => {
      setValidaciones((v) => {
        if (v >= VALIDACIONES.length) { clearInterval(iv); return v }
        return v + 1
      })
    }, 600)
    return () => clearInterval(iv)
  }, [revelados])

  const todoListo = validaciones >= VALIDACIONES.length
  const stepActual = fase === 'extracted' ? 1 : 0

  return (
    <div className="space-y-5 px-4 pb-28 pt-4">
      <Stepper steps={STEPS} current={stepActual} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Verificación de identidad</h2>
        <Badge variant="info">DEMO</Badge>
      </div>

      {fase !== 'extracted' && (
        <>
          <p className="text-sm text-slate-500">
            Escanea tu credencial INE. El sistema extrae tus datos automáticamente con
            reconocimiento óptico (OCR) y los valida contra fuentes oficiales.
          </p>

          <IneMock scanning={fase === 'scanning'} />

          {fase === 'scanning' ? (
            <div className="flex items-center justify-center gap-2 py-1 text-sm font-semibold text-primary">
              <Loader2 size={15} className="animate-spin" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={msgIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  {MENSAJES_SCAN[msgIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<ScanLine size={18} />}
              onClick={iniciarEscaneo}
            >
              Escanear INE
            </Button>
          )}

          <p className="text-center text-[11px] text-slate-400">
            En producción: cámara del dispositivo + Google Cloud Vision API.
            Esta pantalla usa una credencial de muestra.
          </p>
        </>
      )}

      {fase === 'extracted' && (
        <>
          <div className="flex items-center gap-2 text-sm font-semibold text-success">
            <CheckCircle2 size={16} />
            Documento leído correctamente
          </div>

          {/* Campos extraídos por OCR */}
          <Card variant="outlined" padding="md" className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Datos extraídos (OCR)
            </p>
            {CAMPOS_OCR.map((campo, i) => (
              <div key={campo.label} className="flex items-center justify-between gap-4 text-sm">
                <span className="shrink-0 text-slate-500">{campo.label}</span>
                <span className="text-right">
                  <TypedValue text={campo.value} active={revelados > i} />
                </span>
              </div>
            ))}
          </Card>

          {/* Validaciones contra fuentes externas */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Validación en fuentes oficiales
            </p>
            {VALIDACIONES.map((v, i) => (
              <motion.div
                key={v.fuente}
                initial={{ opacity: 0, x: -8 }}
                animate={validaciones > i ? { opacity: 1, x: 0 } : {}}
                className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-card"
                style={{ visibility: validaciones > i ? 'visible' : 'hidden' }}
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-success/10">
                  <ShieldCheck size={15} className="text-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-ink">{v.fuente}</p>
                  <p className="text-[11px] text-slate-500">{v.detalle}</p>
                </div>
                <CheckCircle2 size={16} className="shrink-0 text-success" />
              </motion.div>
            ))}
          </div>

          {todoListo && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ChevronRight size={17} />}
                onClick={() => navigate(ROUTES.VERIFICATION_RESULT)}
              >
                Ver resultado de verificación
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
