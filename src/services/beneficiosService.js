import { mockFetch, delay } from './api'
import aliadosRaw from '@/data/aliados.json'

let _store = [...aliadosRaw]

// Canjes generados durante la sesión: { [aliadoId]: { codigo, generadoEn, expiraEn } }
const _canjes = {}

export async function listAliados(filtros = {}) {
  let result = [..._store]
  if (filtros.activo !== undefined) result = result.filter((a) => a.activo === filtros.activo)
  if (filtros.categoria) result = result.filter((a) => a.categoria === filtros.categoria)
  return mockFetch(result)
}

export async function getAliado(id) {
  return mockFetch(_store.find((a) => a.id === id) ?? null)
}

// Genera un código de canje único por aliado (persiste durante la sesión)
export async function canjearBeneficio(aliadoId) {
  await delay(900)
  if (_canjes[aliadoId]) return structuredClone(_canjes[aliadoId])

  const codigo = `PIK-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`
  const canje = {
    aliadoId,
    codigo,
    generadoEn: new Date().toISOString(),
    expiraEn:   new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
  }
  _canjes[aliadoId] = canje
  _store = _store.map((a) =>
    a.id === aliadoId ? { ...a, totalCanjes: a.totalCanjes + 1 } : a
  )
  return structuredClone(canje)
}

export function getCanjeActivo(aliadoId) {
  return _canjes[aliadoId] ? structuredClone(_canjes[aliadoId]) : null
}
