// ─── Auth / User ────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string | null
  phone: string | null
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

// ─── Team ────────────────────────────────────────────────────────────────────

export interface Team {
  id: number
  name: string
  country_code: string
  group_name: string
}

// ─── Match ────────────────────────────────────────────────────────────────────

export type MatchStatus = 'scheduled' | 'live' | 'finished'
export type MatchStage =
  | 'group'
  | 'round_of_32'
  | 'round_of_16'
  | 'quarterfinals'
  | 'semifinals'
  | 'third_place'
  | 'final'

export interface Match {
  id: number
  match_number: number
  home_team_id: number | null
  away_team_id: number | null
  home_team: Team | null
  away_team: Team | null
  home_score: number | null
  away_score: number | null
  match_date: string
  venue: string
  stage: MatchStage
  group_name: string | null
  status: MatchStatus
}

// ─── Pool ─────────────────────────────────────────────────────────────────────

export type BetVisibility = 'always' | 'during_match' | 'never'

export interface Pool {
  id: string
  name: string
  code: string
  creator_id: string
  quota_value: number | null
  estimated_prize: number | null
  bet_visibility: BetVisibility
  created_at: string
  // enriched fields
  member_count?: number
  rules?: PoolRule
  is_finished?: boolean
  is_creator?: boolean
  accepted_rules?: boolean
}

// ─── Pool Rule ────────────────────────────────────────────────────────────────

export interface PoolRule {
  id: number
  pool_id: string
  exact_score_points: number
  one_team_score_points: number
  draw_points: number
  goal_difference_points: number
  description: string | null
}

// ─── Pool Member ──────────────────────────────────────────────────────────────

export interface PoolMember {
  user_id: string
  pool_id: string
  name: string
  email: string | null
  phone: string | null
  accepted_rules: boolean
  joined_at: string
}

// ─── Pool Match Setting ───────────────────────────────────────────────────────

export interface PoolMatchSetting {
  pool_id: string
  match_id: number
  bet_open_at: string | null
  bet_close_at: string | null
}

// ─── Invitation ───────────────────────────────────────────────────────────────

export type InvitationStatus = 'pending' | 'accepted' | 'cancelled'
export type InvitationSentVia = 'email' | 'sms' | 'link'

export interface Invitation {
  id: string
  pool_id: string
  inviter_id: string
  invitee_email: string | null
  invitee_phone: string | null
  token: string
  status: InvitationStatus
  sent_via: InvitationSentVia
  created_at: string
}

// ─── Bet ──────────────────────────────────────────────────────────────────────

export interface Bet {
  id: string
  pool_id: string
  user_id: string
  match_id: number
  home_score_bet: number
  away_score_bet: number
  points_earned: number | null
  // join fields
  match?: Match
  user_name?: string
}

// ─── Ranking ──────────────────────────────────────────────────────────────────

export interface RankingBet {
  match_id: number
  match_number: number
  home_team: string | null
  away_team: string | null
  home_score_bet: number
  away_score_bet: number
  actual_home: number | null
  actual_away: number | null
  points_earned: number | null
}

export interface RankingEntry {
  position: number
  user_id: string
  user_name: string
  total_points: number
  bets: RankingBet[]
}

export interface RankingResponse {
  ranking: RankingEntry[]
  is_finished: boolean
  champion: RankingEntry | null
  prize: number | null
}

// ─── API Generic ──────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
}
