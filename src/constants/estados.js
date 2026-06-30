// Enums de dominio + mapas de color/etiqueta.
// Fuente única para <StatusBadge>. Ver CONTRACT.md §2.8.

export const ROL_USUARIO = {
  MOTOCICLISTA: 'motociclista',
  OPERADOR: 'operador',
  ADMIN: 'admin',
}

export const ESTADO_CERTIFICACION = {
  NO_INICIADO: 'no_iniciado',
  EN_PROCESO: 'en_proceso',
  PENDIENTE_PAGO: 'pendiente_pago',
  CERTIFICADO: 'certificado',
  VENCIDO: 'vencido',
  RECHAZADO: 'rechazado',
}

export const ESTADO_CITA = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  EN_CURSO: 'en_curso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
  NO_ASISTIO: 'no_asistio',
  REPROGRAMADA: 'reprogramada',
}

export const ESTADO_PAGO = {
  PENDIENTE: 'pendiente',
  PROCESANDO: 'procesando',
  COMPLETADO: 'completado',
  FALLIDO: 'fallido',
  REEMBOLSADO: 'reembolsado',
}

export const MEMBRESIA = { FREE: 'free', PREMIUM: 'premium' }

// estado -> variante visual de <Badge>: success | warning | danger | info | neutral
export const ESTADO_COLOR = {
  // certificación
  certificado: 'success',
  en_proceso: 'warning',
  pendiente_pago: 'warning',
  no_iniciado: 'neutral',
  vencido: 'danger',
  rechazado: 'danger',
  // citas
  confirmada: 'success',
  completada: 'success',
  pendiente: 'warning',
  en_curso: 'info',
  reprogramada: 'info',
  cancelada: 'danger',
  no_asistio: 'danger',
  // pagos
  completado: 'success',
  procesando: 'warning',
  fallido: 'danger',
  reembolsado: 'info',
}

// estado -> etiqueta legible en español
export const ESTADO_LABEL = {
  no_iniciado: 'No iniciado',
  en_proceso: 'En proceso',
  pendiente_pago: 'Pendiente de pago',
  certificado: 'Certificado',
  vencido: 'Vencido',
  rechazado: 'Rechazado',
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  en_curso: 'En curso',
  completada: 'Completada',
  cancelada: 'Cancelada',
  no_asistio: 'No asistió',
  reprogramada: 'Reprogramada',
  procesando: 'Procesando',
  completado: 'Completado',
  fallido: 'Fallido',
  reembolsado: 'Reembolsado',
}
