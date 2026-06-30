// Helper de mock-API. Simula latencia de red y errores ocasionales.
// Ver CONTRACT.md §5.
const LATENCY = Number(import.meta.env.VITE_MOCK_LATENCY ?? 600)

export function delay(ms = LATENCY) {
  return new Promise((res) => setTimeout(res, ms))
}

// Envuelve datos en una promesa con latencia. Usa esto en todos los services.
export async function mockFetch(data) {
  await delay()
  return structuredClone(data) // aísla los datos mock de mutaciones
}
