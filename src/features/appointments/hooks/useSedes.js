import { useAsync } from '@/hooks/useAsync'
import { listSedes } from '@/services/sedesService'

// filtros se serializa a string para comparación estable en useAsync deps
export function useSedes(filtros) {
  const key = JSON.stringify(filtros ?? {})
  const { data, loading, error } = useAsync(
    () => listSedes(filtros ?? {}),
    [key] // eslint-disable-line react-hooks/exhaustive-deps
  )
  return { sedes: data ?? [], loading, error }
}
