import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import poolReducer from './poolSlice'
import matchReducer from './matchSlice'
import betReducer from './betSlice'
import rankingReducer from './rankingSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pool: poolReducer,
    match: matchReducer,
    bet: betReducer,
    ranking: rankingReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
