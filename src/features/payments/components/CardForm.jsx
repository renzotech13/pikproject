import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { luhnValid } from '@/services/pagosService'
import { formatMXN } from '@/lib/formatters'
import { cn } from '@/lib/cn'

// ── Helpers ───────────────────────────────────────────────────────────────

function fmtCardNum(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function fmtExpiry(val) {
  const clean = val.replace(/\D/g, '').slice(0, 4)
  if (clean.length <= 2) return clean
  return `${clean.slice(0, 2)}/${clean.slice(2)}`
}

function detectCardType(num) {
  const n = num.replace(/\D/g, '')
  if (n.startsWith('4'))      return 'visa'
  if (/^5[1-5]/.test(n))     return 'mc'
  if (/^3[47]/.test(n))      return 'amex'
  if (/^6(?:011|5)/.test(n)) return 'discover'
  return null
}

// ── Tarjeta visual (display only) ─────────────────────────────────────────

function CardVisual({ numero, titular, expiry, cardType }) {
  const displayNum = numero.padEnd(16, '·').match(/.{1,4}/g)?.join(' ') ?? '···· ···· ···· ····'

  return (
    <div className="relative mx-auto h-[152px] w-full max-w-[280px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 shadow-float select-none">
      {/* Círculos decorativos */}
      <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-white/5" />

      {/* Chip + logo tipo */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-9 rounded-sm bg-amber-300/70" />
        <span className="text-xs font-bold tracking-wide text-white/70 uppercase">
          {cardType === 'visa'     && 'VISA'}
          {cardType === 'mc'       && 'MC'}
          {cardType === 'amex'     && 'AMEX'}
          {cardType === 'discover' && 'DISC'}
        </span>
      </div>

      {/* Número */}
      <p className="mt-3 font-mono text-sm tracking-[0.2em] text-white/80">
        {displayNum}
      </p>

      {/* Titular + Vence */}
      <div className="mt-2.5 flex items-end justify-between">
        <div>
          <p className="text-[9px] uppercase text-white/40">Titular</p>
          <p className="text-xs font-semibold uppercase text-white truncate max-w-[140px]">
            {titular || '—'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase text-white/40">Vence</p>
          <p className="text-xs font-semibold text-white">{expiry || 'MM/YY'}</p>
        </div>
      </div>
    </div>
  )
}

// ── CardForm ──────────────────────────────────────────────────────────────
// Props: monto (number), onPay(cardData), loading (bool), error (string|null)

export default function CardForm({ monto, onPay, loading, error }) {
  const [numero,  setNumero]  = useState('')
  const [titular, setTitular] = useState('')
  const [expiry,  setExpiry]  = useState('')
  const [cvv,     setCvv]     = useState('')

  const rawNum     = numero.replace(/\D/g, '')
  const cardType   = detectCardType(rawNum)
  const luhnOk     = rawNum.length >= 13 && luhnValid(rawNum)
  const luhnFail   = rawNum.length >= 13 && !luhnOk
  const formValid  = luhnOk && titular.trim().length >= 3 && expiry.length === 5 && cvv.length >= 3

  function handleSubmit(e) {
    e.preventDefault()
    if (!formValid || loading) return
    onPay({ numeroTarjeta: rawNum, titular, expiry, cvv })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tarjeta visual */}
      <CardVisual numero={rawNum} titular={titular} expiry={expiry} cardType={cardType} />

      {/* Número de tarjeta */}
      <div className="relative">
        <Input
          label="Número de tarjeta"
          name="numero"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4111 1111 1111 1111"
          value={numero}
          maxLength={19}
          onChange={(e) => setNumero(fmtCardNum(e.target.value))}
          error={luhnFail ? 'Número de tarjeta inválido' : undefined}
        />
        {/* Indicador Luhn */}
        {rawNum.length >= 13 && (
          <div className="absolute right-3 top-9">
            {luhnOk
              ? <CheckCircle2 size={16} className="text-success" />
              : <XCircle     size={16} className="text-danger"  />
            }
          </div>
        )}
      </div>

      {/* Titular */}
      <Input
        label="Nombre del titular"
        name="titular"
        autoComplete="cc-name"
        placeholder="Como aparece en la tarjeta"
        value={titular}
        onChange={(e) => setTitular(e.target.value.toUpperCase())}
      />

      {/* Fecha + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Fecha de vencimiento"
          name="expiry"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          value={expiry}
          maxLength={5}
          onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
        />
        <Input
          label="CVV"
          name="cvv"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="•••"
          type="password"
          value={cvv}
          maxLength={cardType === 'amex' ? 4 : 3}
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
        />
      </div>

      {/* Error del servidor */}
      {error && (
        <p className="rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">{error}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={!formValid}
      >
        Pagar {formatMXN(monto)}
      </Button>

      <p className="text-center text-[11px] text-slate-400">
        🔒 Conexión segura TLS 1.3 · Datos cifrados en tránsito
      </p>
    </form>
  )
}
