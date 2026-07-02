import { mockFetch } from './api'
import sedesRaw from '@/data/sedes.json'

export async function listSedes(filtros = {}) {
  let result = [...sedesRaw]
  if (filtros.activa !== undefined) result = result.filter((s) => s.activa === filtros.activa)
  if (filtros.distrito) result = result.filter((s) => s.distrito === filtros.distrito)
  return mockFetch(result)
}

export async function getSede(id) {
  return mockFetch(sedesRaw.find((s) => s.id === id) ?? null)
}

// Slots de disponibilidad simulados.
// La "ocupación" varía por fecha+sede para dar sensación de dinamismo real.
const BASE_SLOTS = [
  { hora: '08:00', disponible: true },
  { hora: '08:45', disponible: true },
  { hora: '09:30', disponible: true },
  { hora: '10:15', disponible: false },
  { hora: '11:00', disponible: true },
  { hora: '11:45', disponible: true },
  { hora: '14:00', disponible: true },
  { hora: '14:45', disponible: false },
  { hora: '15:30', disponible: true },
  { hora: '16:15', disponible: true },
]

// Slots reservados durante la sesión — anti-overbooking:
// al confirmar una cita el horario deja de estar disponible para todos.
const _reservados = new Set()

export function marcarSlotOcupado(sedeId, fecha, hora) {
  _reservados.add(`${sedeId}|${fecha}|${hora}`)
}

export async function getDisponibilidad(sedeId, fecha) {
  const seed = fecha
    ? fecha.split('-').reduce((a, b) => a + parseInt(b, 10), 0) % BASE_SLOTS.length
    : 0
  const slots = BASE_SLOTS.map((s, i) => ({
    ...s,
    disponible:
      s.disponible &&
      i !== seed &&
      i !== (seed + 3) % BASE_SLOTS.length &&
      !_reservados.has(`${sedeId}|${fecha}|${s.hora}`),
  }))
  return mockFetch(slots)
}
