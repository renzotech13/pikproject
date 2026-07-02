import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { ShieldCheck, RefreshCw, Eye, EyeOff, Bike, CheckCircle2 } from 'lucide-react'
import { Badge, Card } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { getIniciales } from '@/lib/formatters'

function genToken() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

const TTL_SEGUNDOS = 30

export default function DigitalCredential() {
  const { currentUser } = useAuth()

  // Token dinámico anti-falsificación: el QR se regenera cada 30 s
  const [token, setToken] = useState(genToken)
  const [ttl, setTtl]     = useState(TTL_SEGUNDOS)
  const [verificador, setVerificador] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => {
      setTtl((t) => {
        if (t <= 1) { setToken(genToken()); return TTL_SEGUNDOS }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  const nombre   = `${currentUser?.nombres} ${currentUser?.apellidos}`
  const codigo   = currentUser?.codigoPIK ?? 'PIK-2026-000000'
  const qrValue  = `https://verify.pik.mx/${codigo}?t=${token}`
  const vehiculo = currentUser?.vehiculo

  return (
    <div className="space-y-4 px-4 pb-28 pt-4">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Credencial digital</h2>
        <Badge variant="info">DEMO</Badge>
      </div>

      {/* ── Carnet PIK ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-indigo-700 p-5 text-white shadow-float"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-white/60">PIK · CREDENCIAL</p>
            <p className="mt-3 text-lg font-bold leading-tight">{nombre}</p>
            <p className="font-mono text-sm tracking-wider text-white/80">{codigo}</p>
          </div>
          {/* Avatar */}
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 text-sm font-bold">
            {getIniciales(nombre)}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold">
            <ShieldCheck size={11} /> CERTIFICADO VIGENTE
          </span>
          <span className="rounded-full bg-amber-400/90 px-2.5 py-1 text-[10px] font-bold text-amber-950">
            {currentUser?.membresia === 'premium' ? 'PREMIUM' : 'FREE'}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between text-[11px] text-white/60">
          <div>
            <p>Vigencia</p>
            <p className="font-semibold text-white/90">{currentUser?.fechaVencimiento}</p>
          </div>
          <div className="text-right">
            <p>Score PIK</p>
            <p className="text-base font-black text-white">{currentUser?.scorePIK}</p>
          </div>
        </div>
      </motion.div>

      {/* ── QR dinámico ── */}
      <Card variant="outlined" padding="lg" className="flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={token}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl bg-white p-3 ring-1 ring-slate-100"
          >
            <QRCodeSVG value={qrValue} size={168} fgColor="#0F172A" />
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <RefreshCw size={11} className={ttl <= 3 ? 'animate-spin text-primary' : ''} />
          Token <span className="font-mono font-bold text-slate-600">{token}</span> · se renueva en {ttl}s
        </div>
        <p className="text-center text-[11px] leading-relaxed text-slate-400">
          El código QR incluye un token de un solo uso que rota cada {TTL_SEGUNDOS} segundos —
          una captura de pantalla no sirve para suplantar la credencial.
        </p>
      </Card>

      {/* ── Toggle modo verificador ── */}
      <button
        onClick={() => setVerificador((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
      >
        {verificador ? <EyeOff size={16} /> : <Eye size={16} />}
        {verificador ? 'Ocultar vista del verificador' : '¿Qué ve quien escanea? (aliado / autoridad)'}
      </button>

      <AnimatePresence>
        {verificador && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                PIK Verify · resultado del escaneo
              </p>

              <div className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-500/10 px-3 py-3 ring-1 ring-emerald-500/30">
                <CheckCircle2 size={22} className="shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-black text-emerald-400">CERTIFICADO VIGENTE</p>
                  <p className="text-[11px] text-slate-400">Verificado hace 2 segundos</p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-sm">
                {[
                  ['Titular',   nombre],
                  ['Código',    codigo],
                  ['Vigencia',  currentUser?.fechaVencimiento],
                  ['Score PIK', String(currentUser?.scorePIK ?? '—')],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-right font-semibold">{value}</span>
                  </div>
                ))}
                {vehiculo && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Vehículo</span>
                    <span className="flex items-center gap-1.5 text-right font-semibold">
                      <Bike size={13} className="text-slate-500" />
                      {vehiculo.marca} {vehiculo.modelo} · {vehiculo.placa}
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-4 text-center text-[10px] text-slate-600">
                Esta vista es la que obtiene un aliado comercial o autoridad al escanear el QR.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
