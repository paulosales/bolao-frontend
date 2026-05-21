import api from './api'
import { Pool, PoolMember, PoolRule, PoolMatchSetting, RankingResponse } from '../types'

export const poolService = {
  async getMyPools(): Promise<Pool[]> {
    const res = await api.get<Pool[]>('/pools')
    return res.data
  },

  async getPool(id: string): Promise<Pool> {
    const res = await api.get<Pool>(`/pools/${id}`)
    return res.data
  },

  async createPool(data: {
    name: string
    quota_value?: number
    estimated_prize?: number
    bet_visibility?: string
  }): Promise<Pool> {
    const res = await api.post<Pool>('/pools', data)
    return res.data
  },

  async updatePool(
    id: string,
    data: {
      name?: string
      quota_value?: number
      estimated_prize?: number
      bet_visibility?: string
    }
  ): Promise<Pool> {
    const res = await api.put<Pool>(`/pools/${id}`, data)
    return res.data
  },

  async deletePool(id: string): Promise<void> {
    await api.delete(`/pools/${id}`)
  },

  async getMembers(poolId: string): Promise<PoolMember[]> {
    const res = await api.get<PoolMember[]>(`/pools/${poolId}/members`)
    return res.data
  },

  async removeMember(poolId: string, userId: string): Promise<void> {
    await api.delete(`/pools/${poolId}/members/${userId}`)
  },

  async getRules(poolId: string): Promise<PoolRule> {
    const res = await api.get<PoolRule>(`/pools/${poolId}/rules`)
    return res.data
  },

  async updateRules(
    poolId: string,
    data: {
      exact_score_points: number
      one_team_score_points: number
      draw_points: number
      goal_difference_points: number
      description?: string
    }
  ): Promise<PoolRule> {
    const res = await api.put<PoolRule>(`/pools/${poolId}/rules`, data)
    return res.data
  },

  async acceptRules(poolId: string): Promise<void> {
    await api.post(`/pools/${poolId}/rules/accept`)
  },

  async getMatchSettings(poolId: string): Promise<PoolMatchSetting[]> {
    const res = await api.get<PoolMatchSetting[]>(`/pools/${poolId}/match-settings`)
    return res.data
  },

  async updateMatchSetting(
    poolId: string,
    matchId: number,
    data: { bet_open_at?: string | null; bet_close_at?: string | null }
  ): Promise<PoolMatchSetting> {
    const res = await api.put<PoolMatchSetting>(
      `/pools/${poolId}/match-settings/${matchId}`,
      data
    )
    return res.data
  },

  async getRanking(poolId: string): Promise<RankingResponse> {
    const res = await api.get<RankingResponse>(`/pools/${poolId}/ranking`)
    return res.data
  },

  // Invitations
  async inviteByEmail(poolId: string, email: string): Promise<{ message: string }> {
    const res = await api.post(`/pools/${poolId}/invitations`, { email })
    return res.data
  },

  async inviteBySms(poolId: string, phone: string): Promise<{ message: string }> {
    const res = await api.post(`/pools/${poolId}/invitations`, { phone })
    return res.data
  },

  async generateInviteLink(poolId: string): Promise<{ link: string }> {
    const res = await api.post<{ link: string }>(`/pools/${poolId}/invitations/link`)
    return res.data
  },

  async getInvitations(poolId: string) {
    const res = await api.get(`/pools/${poolId}/invitations`)
    return res.data
  },

  async cancelInvitation(poolId: string, invitationId: string): Promise<void> {
    await api.delete(`/pools/${poolId}/invitations/${invitationId}`)
  },
}
