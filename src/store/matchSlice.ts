import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Match } from '../types'
import { matchService } from '../services/matchService'

interface MatchState {
  matches: Match[]
  loading: boolean
  error: string | null
}

const initialState: MatchState = {
  matches: [],
  loading: false,
  error: null,
}

export const fetchMatches = createAsyncThunk('match/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await matchService.getMatches()
  } catch {
    return rejectWithValue('Erro ao buscar jogos')
  }
})

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => { state.loading = true })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false
        state.matches = action.payload
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default matchSlice.reducer
