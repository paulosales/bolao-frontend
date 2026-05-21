import api from './api'
import { Match } from '../types'

export const matchService = {
  async getMatches(): Promise<Match[]> {
    const res = await api.get<Match[]>('/matches')
    return res.data
  },

  async getMatch(id: number): Promise<Match> {
    const res = await api.get<Match>(`/matches/${id}`)
    return res.data
  },
}
