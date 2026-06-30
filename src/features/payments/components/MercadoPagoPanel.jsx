import { useState, useEffect } from 'react'
import { ShieldCheck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatMXN } from '@/lib/formatters'

// ── Logo Mercado Pago (SVG inline) ────────────────────────────────────────

function MercadoPagoLogo({ size = 'md' }) {
  const sizes = { sm: 'h-7 text-sm', md: 'h-9 text-base', lg: 'h-12 text-xl' }
  return (
    <div className={`flex items-center gap-2 ${sizes[size]}`}>
      {/* Círculo MP */}
      <div className={`grid place-items-center rounded-full bg-[#009EE3] ${size === 'lg' ? 'h-10 w-10' : 'h-7 w-7'}`}>
        <span className={`font-black text-white ${size === 'lg' ? 'text-lg' : 'text-xs'}`}>MP</span>
      </div>
      <div className="leading-tight">
        <p className="font-black text-[#009EE3]" style={{ letterSpacing: '-0.02em' }}>
          Mercado
        </p>
        <p className="font-black text-[#009EE3] -mt-0.5" style={{ letterSpacing: '-0.02em' }}>
          Pago
        </p>
      </div>
    </div>
  )
}

// ── WebView simulado de Mercado Pago ──────────────────────────────────────

function MPWebView({ monto, concepto, onComplete }) {
  const [phase, setPhase] = useState('loading') // 'loading' | 'form' | 'processing' | 'approved'

  useEffect(() => {
    // Simula tiempo de carga del WebView
    const t1 = setTimeout(() => setPhase('form'), 1200)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (phase === 'processing') {
      const t = setTimeout(() => setPhase('approved'), 1600)
      return () => clearTimeout(t)
    }
    if (phase === 'approved') {
      const t = setTimeout(onComplete, 1200)
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  return (
    // Overlay full-screen — simula apertura de WebView del banco
    <div className="fixed inset-0 z-50 flex flex-col bg-white">

      {/* Header MP */}
      <div className="flex items-center gap-3 bg-[#009EE3] px-4 py-3 pt-safe">
        <button
          className="text-white/80 text-sm"
          onClick={() => { /* back button — solo UX demo */ }}
        >
          ✕
        </button>
        <div className="flex-1 text-center">
          <p className="text-xs font-semibold text-white/90">checkout.mercadopago.com.mx</p>
        </div>
        <ShieldCheck size={16} className="text-white/80" />
      </div>

      {/* Contenido del WebView */}
      <div className="flex flex-1 flex-col overflow-y-auto p-6">

        {phase === 'loading' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <MercadoPagoLogo size="lg" />
            <div className="h-1 w-32 overflow-hidden rounded-full bg-slate-100">
              <div className="h-1 w-full animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-[#009EE3]" />
            </div>
            <p className="text-sm text-slate-500">Cargando pasarela de pago…</p>
          </div>
        )}

        {phase === 'form' && (
          <div className="space-y-6">
            <MercadoPagoLogo size="md" />

            {/* Resumen de pago */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Estás pagando a</p>
              <p className="mt-0.5 font-bold text-ink">PIK Certificaciones</p>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-slate-500">{concepto}</span>
                <span className="font-bold text-ink">{formatMXN(monto)}</span>
              </div>
            </div>

            {/* Forma de pago mock */}
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-500">Método de pago</p>
              <div className="flex items-center gap-3 rounded-xl border border-[#009EE3]/30 bg-[#009EE3]/5 p-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#009EE3]">
                  <span className="text-[10px] font-black text-white">MP</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Saldo en cuenta</p>
                  <p className="text-xs text-slate-500">{formatMXN(monto)} disponible</p>
                </div>
                <div className="ml-auto h-4 w-4 rounded-full border-2 border-[#009EE3] bg-[#009EE3]" />
              </div>
            </div>

            <button
              onClick={() => setPhase('processing')}
              className="w-full rounded-xl bg-[#009EE3] py-3.5 font-bold text-white active:bg-[#0077b6]"
            >
              Confirmar pago — {formatMXN(monto)}
            </button>

            <p className="text-center text-[11px] text-slate-400">
              Al confirmar aceptas los <span className="text-[#009EE3]">Términos y condiciones</span> de Mercado Pago
            </p>
          </div>
        )}

        {phase === 'processing' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#009EE3]/10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#009EE3] border-t-transparent" />
            </div>
            <p className="font-semibold text-slate-700">Procesando tu pago…</p>
            <p className="text-sm text-slate-400">No cierres esta ventana</p>
          </div>
        )}

        {phase === 'approved' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-success/10">
              <CheckCircle size={40} className="text-success" />
            </div>
            <p className="text-xl font-bold text-success">¡Pago aprobado!</p>
            <p className="text-sm text-slate-500">Redirigiendo a PIK…</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Panel principal de Mercado Pago ───────────────────────────────────────
// Props: monto, concepto, onPay(), loading

export default function MercadoPagoPanel({ monto, concepto, onPay, loading }) {
  const [showWebView, setShowWebView] = useState(false)

  return (
    <div className="space-y-5">
      {/* Logo + descripción */}
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <MercadoPagoLogo size="lg" />
        <p className="text-sm text-slate-500">
          Serás redirigido de forma segura a la pasarela de Mercado Pago para completar tu pago.
        </p>
      </div>

      {/* Beneficios */}
      <div className="space-y-2">
        {[
          'Pago protegido por Mercado Pago',
          'Acepta tarjetas, saldo y meses sin intereses',
          'Confirmación instantánea',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle size={14} className="shrink-0 text-[#009EE3]" />
            {item}
          </div>
        ))}
      </div>

      {/* Monto */}
      <div className="rounded-xl bg-[#009EE3]/5 px-4 py-3 text-center">
        <p className="text-xs text-slate-500">Total a pagar</p>
        <p className="text-2xl font-black text-[#009EE3]">{formatMXN(monto)}</p>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        onClick={() => setShowWebView(true)}
        className="bg-[#009EE3] hover:bg-[#0077b6] active:bg-[#005f91]"
      >
        Pagar con Mercado Pago
      </Button>

      {/* WebView simulado */}
      {showWebView && (
        <MPWebView
          monto={monto}
          concepto={concepto}
          onComplete={() => {
            setShowWebView(false)
            onPay()
          }}
        />
      )}
    </div>
  )
}
