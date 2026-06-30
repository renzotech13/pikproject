import { mockFetch } from './api'
import citasRaw from '@/data/citas.json'

// Store mutable en memoria: simula persistencia durante la sesión de demo.
// Las mutaciones (crearCita, cancelarCita) se reflejan inmediatamente en listCitas.
let _store = [...citasRaw]

export async function listCitas(usuarioId) {
  const result = usuarioId ? _store.filter((c) => c.usuarioId === usuarioId) : [..._store]
  return mockFetch(result)
}

export async function getCita(id) {
  return mockFetch(_store.find((c) => c.id === id) ?? null)
}

export async function crearCita(payload) {
  const nueva = {
    id: `cita_${Date.now()}`,
    estado: 'pendiente_pago',
    pagada: false,
    pagoId: null,
    codigoReserva: `CITA-${Math.random().toString(36).toUpperCase().slice(2, 7)}`,
    checklist: [
      { item: 'INE vigente', obligatorio: true, completado: false },
      { item: 'Licencia de conducir', obligatorio: true, completado: false },
      { item: 'Seguro vehicular vigente', obligatorio: true, completado: false },
    ],
    creadaEn: new Date().toISOString(),
    ...payload,
  }
  _store = [..._store, nueva]
  return mockFetch(nueva)
}

export async function confirmarCita(id) {
  _store = _store.map((c) => c.id === id ? { ...c, estado: 'confirmada', pagada: true } : c)
  return mockFetch(_store.find((c) => c.id === id) ?? null)
}

export async function cancelarCita(id) {
  _store = _store.map((c) => (c.id === id ? { ...c, estado: 'cancelada' } : c))
  return mockFetch(_store.find((c) => c.id === id) ?? null)
}

export async function reprogramarCita(id, { fecha, hora }) {
  _store = _store.map((c) => (c.id === id ? { ...c, fecha, hora, estado: 'reprogramada' } : c))
  return mockFetch(_store.find((c) => c.id === id) ?? null)
}
