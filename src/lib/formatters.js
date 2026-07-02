// Formateadores compartidos. Ver CONTRACT.md §0 (dinero/fechas).
// Mercado: México — toda cifra monetaria se formatea en MXN con locale es-MX.

export function formatMXN(amount) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount ?? 0)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('es-MX').format(value ?? 0)
}

export function formatPercent(ratio, decimals = 1) {
  return `${((ratio ?? 0) * 100).toFixed(decimals)}%`
}

export function getIniciales(nombre = '') {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
