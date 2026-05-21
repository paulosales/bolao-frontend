import { describe, it, expect, beforeEach } from 'vitest'
import authReducer, { logout, setToken, setUser, clearError } from '../../store/authSlice'
import { AuthState, User } from '../../types'

const testUser: User = {
  id: '1',
  name: 'Paulo',
  email: 'paulo@example.com',
  phone: null,
  created_at: '2026-01-01T00:00:00',
}

const emptyState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

describe('authSlice reducers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns a sensible initial state', () => {
    const state = authReducer(undefined, { type: '@@INIT' })
    expect(state.user).toBeNull()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })

  describe('setToken', () => {
    it('stores the token in state', () => {
      const state = authReducer(emptyState, setToken('my-jwt-token'))
      expect(state.token).toBe('my-jwt-token')
    })

    it('persists the token to localStorage', () => {
      authReducer(emptyState, setToken('persisted-token'))
      expect(localStorage.getItem('token')).toBe('persisted-token')
    })

    it('overwrites a previously stored token', () => {
      const s1 = authReducer(emptyState, setToken('old-token'))
      const s2 = authReducer(s1, setToken('new-token'))
      expect(s2.token).toBe('new-token')
      expect(localStorage.getItem('token')).toBe('new-token')
    })
  })

  describe('setUser', () => {
    it('stores the user in state', () => {
      const state = authReducer(emptyState, setUser(testUser))
      expect(state.user).toEqual(testUser)
    })

    it('does not affect token or loading', () => {
      const state = authReducer({ ...emptyState, token: 'tok' }, setUser(testUser))
      expect(state.token).toBe('tok')
      expect(state.loading).toBe(false)
    })
  })

  describe('logout', () => {
    it('clears user and token from state', () => {
      const populated: AuthState = { user: testUser, token: 'tok', loading: false, error: null }
      const state = authReducer(populated, logout())
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
    })

    it('removes token from localStorage', () => {
      localStorage.setItem('token', 'stored-tok')
      authReducer({ ...emptyState, token: 'stored-tok' }, logout())
      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  describe('clearError', () => {
    it('sets error to null', () => {
      const withError: AuthState = { ...emptyState, error: 'Senha incorreta' }
      const state = authReducer(withError, clearError())
      expect(state.error).toBeNull()
    })

    it('is a no-op when error is already null', () => {
      const state = authReducer(emptyState, clearError())
      expect(state.error).toBeNull()
    })
  })
})

describe('authSlice async actions — pending/fulfilled/rejected shape', () => {
  it('login.pending sets loading=true and clears error', () => {
    const state = authReducer(
      { ...emptyState, error: 'previous error' },
      { type: 'auth/login/pending' }
    )
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('login.fulfilled stores user and token', () => {
    const state = authReducer(emptyState, {
      type: 'auth/login/fulfilled',
      payload: { user: testUser, token: 'jwt-from-server' },
    })
    expect(state.loading).toBe(false)
    expect(state.user).toEqual(testUser)
    expect(state.token).toBe('jwt-from-server')
    expect(localStorage.getItem('token')).toBe('jwt-from-server')
  })

  it('login.rejected stores error message', () => {
    const state = authReducer(emptyState, {
      type: 'auth/login/rejected',
      payload: 'Credenciais inválidas',
    })
    expect(state.loading).toBe(false)
    expect(state.error).toBe('Credenciais inválidas')
    expect(state.user).toBeNull()
  })

  it('register.fulfilled stores user and token', () => {
    const state = authReducer(emptyState, {
      type: 'auth/register/fulfilled',
      payload: { user: testUser, token: 'new-user-token' },
    })
    expect(state.user).toEqual(testUser)
    expect(state.token).toBe('new-user-token')
  })
})
