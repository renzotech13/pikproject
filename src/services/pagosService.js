import { mockFetch, delay } from './api'
import pagosRaw from '@/data/pagos.json'

let _store = [...pagosRaw]

// ── Luhn algorithm — valida números de tarjeta bancaria ──────────────────
export function luhnValid(num) {
  const digits = num.replace(/\D/g, '').split('').reverse().map(Number)
  if (digits.length < 13) return false
  const sum = digits.reduce((acc, d, i) => {
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9 }
    return acc + d
  }, 0)
  return sum % 10 === 0
}

// ── SPEI mock data ───────────────────────────────────────────────────────
export const CLABE_MOCK  = '012345678901234567'
export const BANCO_MOCK  = 'BBVA México'
export const BANCO_CODE  = '012'

// ── Read ─────────────────────────────────────────────────────────────────
export async function listPagos(usuarioId) {
  const result = usuarioId ? _store.filter((p) => p.usuarioId === usuarioId) : [..._store]
  return mockFetch(result)
}

export async function getPago(id) {
  return mockFetch(_store.find((p) => p.id === id) ?? null)
}

// ── Procesar pago ─────────────────────────────────────────────────────────
// metodo: 'tarjeta' | 'mercado_pago' | 'spei'
// Retorna { pago, error } — nunca lanza, errores controlados.
export async function procesarPago(payload) {
  const {
    metodo,
    monto,
    moneda = 'MXN',
    concepto = 'Certificación PIK',
    usuarioId,
    citaId = null,
    numeroTarjeta,
  } = payload

  // Validación local de tarjeta antes de "enviar al servidor"
  if (metodo === 'tarjeta') {
    if (!luhnValid(numeroTarjeta ?? '')) {
      await delay(700)
      return { pago: null, error: 'Número de tarjeta inválido. Verifica los datos e intenta de nuevo.' }
    }
  }

  // Latencia simulada: tarjeta tarda más (realismo bancario), MP y SPEI son rápidos
  const LATENCIA = { tarjeta: 1800, mercado_pago: 300, spei: 400 }
  await delay(LATENCIA[metodo] ?? 1000)

  const codigoOperacion = `OP-${Date.now().toString().slice(-6)}-MX`
  const serie           = 'F001'
  const numero          = String(Math.floor(Math.random() * 90000 + 10000))

  const pago = {
    id:               `pago_${Date.now()}`,
    usuarioId,
    citaId,
    concepto,
    monto,
    moneda,
    metodo,
    // SPEI queda en "procesando" hasta confirmar transferencia bancaria real
    estado:           metodo === 'spei' ? 'procesando' : 'completado',
    codigoOperacion,
    comprobante: {
      tipo:   'factura_electronica',
      serie,
      numero,
      url:    `/comprobantes/${serie}-${numero}.pdf`,
    },
    fecha:   new Date().toISOString(),
    // Para SPEI guardamos la CLABE destino usada
    clabe:   metodo === 'spei' ? CLABE_MOCK : null,
  }

  _store = [..._store, pago]
  return { pago, error: null }
}
