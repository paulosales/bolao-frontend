import api from './api'

interface InvitationDetail {
  pool: { id: string; name: string; code: string }
  rules: {
    exact_score_points: number
    one_team_score_points: number
    draw_points: number
    goal_difference_points: number
    winner_points: number
    description: string | null
  }
  inviter_name: string
  invitee_email: string | null
}

interface AcceptResponse {
  token: string
  user: { id: string; name: string; email: string | null }
}

export const invitationService = {
  async getByToken(token: string): Promise<InvitationDetail> {
    const res = await api.get<InvitationDetail>(`/invitations/${token}`)
    return res.data
  },

  async accept(
    token: string,
    data: { name: string; password: string; email?: string }
  ): Promise<AcceptResponse> {
    const res = await api.post<AcceptResponse>(`/invitations/${token}/accept`, data)
    return res.data
  },

  async join(token: string): Promise<{ pool_id: string }> {
    const res = await api.post<{ pool_id: string }>(`/invitations/${token}/join`)
    return res.data
  },
}
