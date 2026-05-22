import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Bet } from '../types'
import { betService } from '../services/betService'
import { logout } from './authSlice'

interface BetState {
  bets: Bet[]           // current pool bets (all visible)
  myBets: Bet[]         // current user's bets
  loading: boolean
  error: string | null
}

const initialState: BetState = {
  bets: [],
  myBets: [],
  loading: false,
  error: null,
}

export const fetchBets = createAsyncThunk(
  'bet/fetchPool',
  async (poolId: string, { rejectWithValue }) => {
    try {
      return await betService.getPoolBets(poolId)
    } catch {
      return rejectWithValue('Erro ao buscar apostas')
    }
  }
)

export const fetchMyBets = createAsyncThunk(
  'bet/fetchMine',
  async (poolId: string, { rejectWithValue }) => {
    try {
      return await betService.getMyBets(poolId)
    } catch {
      return rejectWithValue('Erro ao buscar suas apostas')
    }
  }
)

export const placeBet = createAsyncThunk(
  'bet/place',
  async (
    data: { poolId: string; matchId: number; home_score_bet: number; away_score_bet: number },
    { rejectWithValue }
  ) => {
    try {
      return await betService.placeBet(data)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string; message?: string } } }
      const msg = e.response?.data?.error ?? e.response?.data?.message ?? 'Erro ao salvar aposta'
      return rejectWithValue(msg)
    }
  }
)

const betSlice = createSlice({
  name: 'bet',
  initialState,
  reducers: {
    clearBets(state) {
      state.bets = []
      state.myBets = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBets.pending, (state) => { state.loading = true })
      .addCase(fetchBets.fulfilled, (state, action) => {
        state.loading = false
        state.bets = action.payload
      })
      .addCase(fetchBets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    builder
      .addCase(fetchMyBets.fulfilled, (state, action) => {
        state.myBets = action.payload
      })
    builder
      .addCase(placeBet.fulfilled, (state, action: PayloadAction<Bet>) => {
        const idx = state.myBets.findIndex((b) => b.match_id === action.payload.match_id)
        if (idx !== -1) state.myBets[idx] = action.payload
        else state.myBets.push(action.payload)
      })
    // Reset bet state on logout to prevent stale data for next user
    builder.addCase(logout, () => initialState)
  },
})

export const { clearBets } = betSlice.actions
export default betSlice.reducer
