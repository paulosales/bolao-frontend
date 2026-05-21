import { useAppSelector, useAppDispatch } from './useRedux'
import { logout } from '../store/authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, token, loading, error } = useAppSelector((s) => s.auth)

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    logout: () => dispatch(logout()),
  }
}
