import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Pool } from '../types'
import { poolService } from '../services/poolService'
import { logout } from './authSlice'

interface PoolState {
  pools: Pool[]
  currentPool: Pool | null
  loading: boolean
  error: string | null
}

const initialState: PoolState = {
  pools: [],
  currentPool: null,
  loading: false,
  error: null,
}

export const fetchMyPools = createAsyncThunk('pool/fetchMine', async (_, { rejectWithValue }) => {
  try {
    return await poolService.getMyPools()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    return rejectWithValue(e.response?.data?.message ?? 'Erro ao buscar bolões')
  }
})

export const fetchPool = createAsyncThunk(
  'pool/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await poolService.getPool(id)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(e.response?.data?.message ?? 'Bolão não encontrado')
    }
  }
)

export const createPool = createAsyncThunk(
  'pool/create',
  async (
    data: { name: string; quota_value?: number; estimated_prize?: number },
    { rejectWithValue }
  ) => {
    try {
      return await poolService.createPool(data)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(e.response?.data?.message ?? 'Erro ao criar bolão')
    }
  }
)

const poolSlice = createSlice({
  name: 'pool',
  initialState,
  reducers: {
    clearCurrentPool(state) {
      state.currentPool = null
    },
    updatePoolInList(state, action: PayloadAction<Pool>) {
      const idx = state.pools.findIndex((p) => p.id === action.payload.id)
      if (idx !== -1) state.pools[idx] = action.payload
      if (state.currentPool?.id === action.payload.id) state.currentPool = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPools.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchMyPools.fulfilled, (state, action) => {
        state.loading = false
        state.pools = action.payload
      })
      .addCase(fetchMyPools.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    builder
      .addCase(fetchPool.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchPool.fulfilled, (state, action) => {
        state.loading = false
        state.currentPool = action.payload
      })
      .addCase(fetchPool.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    builder
      .addCase(createPool.fulfilled, (state, action) => {
        state.pools.unshift(action.payload)
      })
    // Reset pool state on logout to prevent stale data for next user
    builder.addCase(logout, () => initialState)
  },
})

export const { clearCurrentPool, updatePoolInList, clearError } = poolSlice.actions
export default poolSlice.reducer
