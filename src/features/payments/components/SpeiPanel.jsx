import { useState } from 'react'
import { Copy, CheckCircle2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { CLABE_MOCK, BANCO_MOCK, BANCO_CODE } from '@/services/pagosService'
import { formatMXN } from '@/lib/formatters'

// Formatea CLABE en grupos de 4 (3-3-6-1 es el estándar, pero 4-4-4-4-2 es más legible visualmente)
function formatCLABE(clabe) {
  return clabe.match(/.{1,4}/g)?.join(' ') ?? clabe
}

// ── Logo BBVA ─────────────────────────────────────────────────────────────

function BBVALogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#004899]">
        <span className="text-[10px] font-black text-white">BBVA</span>
      </div>
      <div className="leading-tight">
        <p className="text-sm font-black text-[#004899]">BBVA</p>
        <p className="text-[10px] text-slate-500">México</p>
      </div>
    </div>
  )
}

// ── SpeiPanel ─────────────────────────────────────────────────────────────
// Props: monto, concepto, usuarioId, onPay(), loading

export default function SpeiPanel({ monto, concepto, usuarioId, onPay, loading }) {
  const [copied, setCopied]       = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const referencia = `PIK-${(usuarioId ?? 'USR').slice(-4).toUpperCase()}-${Date.now().toString().slice(-5)}`

  function copyClabe() {
    navigator.clipboard.writeText(CLABE_MOCK).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Instrucciones para pago vía SPEI</p>
        <BBVALogo />
      </div>

      {/* Datos bancarios */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">

        {/* CLABE */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            CLABE interbancaria
          </p>
          <div className="mt-1 flex items-center gap-2">
            <p className="flex-1 font-mono text-base font-bold tracking-widest text-ink">
              {formatCLABE(CLABE_MOCK)}
            </p>
            <button
              type="button"
              onClick={copyClabe}
              className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5"
            >
              {copied ? <CheckCircle2 size={13} className="text-success" /> : <Copy size={13} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Banco */}
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Banco receptor</span>
          <span className="font-semibold text-ink">{BANCO_MOCK} ({BANCO_CODE})</span>
        </div>

        {/* Beneficiario */}
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Beneficiario</span>
          <span className="font-semibold text-ink">PIK Certificaciones S.A.P.I.</span>
        </div>

        {/* Concepto */}
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Concepto</span>
          <span className="font-semibold text-ink">{concepto}</span>
        </div>

        {/* Referencia */}
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Referencia</span>
          <span className="font-mono text-sm font-bold text-primary">{referencia}</span>
        </div>

        {/* Monto */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700">Monto exacto a transferir</span>
            <span className="text-lg font-black text-ink">{formatMXN(monto)}</span>
          </div>
          <p className="mt-1 text-[11px] text-danger">
            ⚠ Transfiere el monto exacto o tu pago no será reconocido.
          </p>
        </div>
      </div>

      {/* Pasos */}
      <div className="space-y-1.5">
        {[
          'Ingresa a tu banca en línea o app de tu banco.',
          'Selecciona "Transferencia SPEI" o "CLABE interbancaria".',
          `Ingresa la CLABE ${formatCLABE(CLABE_MOCK)} y el monto exacto.`,
          `Usa la referencia ${referencia} en el campo "Concepto".`,
          'Una vez enviada, regresa aquí y confirma.',
        ].map((paso, i) => (
          <div key={i} className="flex gap-2.5 text-xs text-slate-600">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
              {i + 1}
            </span>
            {paso}
          </div>
        ))}
      </div>

      {/* Nota de tiempo */}
      <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
        <strong>Tiempo de acreditación:</strong> SPEI es en tiempo real. Tu pago se confirma en minutos una vez enviado desde tu banco.
      </p>

      {/* Confirmación del usuario */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-primary/5 p-3">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded accent-primary"
        />
        <span className="text-sm text-slate-700">
          Confirmo que he realizado la transferencia SPEI por <strong>{formatMXN(monto)}</strong> a la CLABE indicada.
        </span>
      </label>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!confirmed}
        loading={loading}
        onClick={onPay}
        leftIcon={<Building2 size={17} />}
      >
        He realizado la transferencia
      </Button>
    </div>
  )
}
