import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RankingResponse } from '../types'
import { poolService } from '../services/poolService'
import { logout } from './authSlice'

interface RankingState {
  data: RankingResponse | null
  loading: boolean
  error: string | null
}

const initialState: RankingState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchRanking = createAsyncThunk(
  'ranking/fetch',
  async (poolId: string, { rejectWithValue }) => {
    try {
      return await poolService.getRanking(poolId)
    } catch {
      return rejectWithValue('Erro ao buscar ranking')
    }
  }
)

const rankingSlice = createSlice({
  name: 'ranking',
  initialState,
  reducers: {
    clearRanking(state) {
      state.data = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRanking.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchRanking.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchRanking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    // Reset ranking state on logout to prevent stale data for next user
    builder.addCase(logout, () => initialState)
  },
})

export const { clearRanking } = rankingSlice.actions
export default rankingSlice.reducer
