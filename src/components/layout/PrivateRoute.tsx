import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function PrivateRoute() {
  const { isAuthenticated, token } = useAuth()

  // Token present but user not yet hydrated → wait
  if (token && !isAuthenticated) return null

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
