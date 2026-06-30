import { useAsync } from '@/hooks/useAsync'
import { useAuth } from '@/context/AuthContext'
import { listCitas } from '@/services/citasService'

export function useAppointments() {
  const { currentUser } = useAuth()
  const { data, loading, error } = useAsync(
    () => listCitas(currentUser?.id),
    [currentUser?.id]
  )
  return { citas: data ?? [], loading, error }
}
