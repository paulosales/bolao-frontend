import api from './api'
import { Bet } from '../types'

export const betService = {
  async getPoolBets(poolId: string): Promise<Bet[]> {
    const res = await api.get<Bet[]>(`/pools/${poolId}/bets`)
    return res.data
  },

  async getMyBets(poolId: string): Promise<Bet[]> {
    const res = await api.get<Bet[]>(`/pools/${poolId}/bets/my`)
    return res.data
  },

  async placeBet(data: {
    poolId: string
    matchId: number
    home_score_bet: number
    away_score_bet: number
  }): Promise<Bet> {
    const res = await api.post<Bet>(`/pools/${data.poolId}/bets`, {
      match_id: data.matchId,
      home_score_bet: data.home_score_bet,
      away_score_bet: data.away_score_bet,
    })
    return res.data
  },
}
