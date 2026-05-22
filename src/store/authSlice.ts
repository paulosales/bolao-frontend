import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User } from '../types'
import { authService } from '../services/authService'

const storedToken = localStorage.getItem('token')

const initialState: AuthState = {
  user: null,
  token: storedToken,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (data: { login: string; password: string }, { rejectWithValue }) => {
    try {
      return await authService.login(data)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(e.response?.data?.message ?? 'Erro ao entrar')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (
    data: { name: string; password: string; email?: string; phone?: string },
    { rejectWithValue }
  ) => {
    try {
      return await authService.register(data)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(e.response?.data?.message ?? 'Erro ao cadastrar')
    }
  }
)

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    return await authService.me()
  } catch {
    return rejectWithValue('Sessão expirada')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.loading = false
      state.error = null
      localStorage.removeItem('token')
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    // register
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    // fetchMe
    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null
        state.token = null
        localStorage.removeItem('token')
      })
  },
})

export const { logout, setToken, setUser, clearError } = authSlice.actions
export default authSlice.reducer
