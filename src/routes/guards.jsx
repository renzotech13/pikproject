import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/routes'

export function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }
  return children
}

export function RequireRole({ roles, children }) {
  const { currentUser, isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} replace />
  if (!roles.includes(currentUser?.rol)) return <Navigate to={ROUTES.APP} replace />
  return children
}
