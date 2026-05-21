import { Match, Bet } from '../../types'
import { flagUrl, scoreSummary } from '../../utils/scoreUtils'
import { formatMatchDate } from '../../utils/dateUtils'

interface Props {
  match: Match
  myBet?: Bet
  onBet?: (match: Match) => void
  bettingOpen?: boolean
}

const stageLabels: Record<string, string> = {
  group: 'Fase de Grupos',
  round_of_32: 'Rodada de 32',
  round_of_16: 'Oitavas de Final',
  quarterfinals: 'Quartas de Final',
  semifinals: 'Semifinal',
  third_place: 'Terceiro Lugar',
  final: 'Final',
}

const statusBadge: Record<string, string> = {
  scheduled: 'badge-gray',
  live: 'badge-green',
  finished: 'badge-blue',
}

const statusLabel: Record<string, string> = {
  scheduled: 'Agendado',
  live: 'Ao Vivo',
  finished: 'Encerrado',
}

export default function MatchCard({ match, myBet, onBet, bettingOpen = true }: Props) {
  const homeFlag = match.home_team
    ? (match.home_team as any).flag_url || ((match.home_team as any).short_name ? `https://flagcdn.com/w80/${(match.home_team as any).short_name.toLowerCase()}.png` : null)
    : null
  const awayFlag = match.away_team
    ? (match.away_team as any).flag_url || ((match.away_team as any).short_name ? `https://flagcdn.com/w80/${(match.away_team as any).short_name.toLowerCase()}.png` : null)
    : null

  return (
    <div className="card p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{stageLabels[match.stage] ?? match.stage}</span>
        <span className={statusBadge[match.status]}>{statusLabel[match.status]}</span>
      </div>

      {/* Teams */}
      <div className="flex items-start justify-between gap-2">
        {/* Home */}
        <div className="flex flex-col h-20 items-center gap-1 flex-1">
          {homeFlag && (
            <img
              src={homeFlag}
              alt={match.home_team?.name}
              className="w-10 h-auto rounded-sm shadow-sm"
            />
          )}
          <span className="text-sm font-semibold text-center">
            {match.home_team?.name ?? 'A definir'}
          </span>
        </div>

        {/* Score / VS */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-gray-800">
            {scoreSummary(match.home_score, match.away_score)}
          </span>
          <span className="text-xs text-gray-400">{formatMatchDate(match.match_date)}</span>
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {awayFlag && (
            <img
              src={awayFlag}
              alt={match.away_team?.name}
              className="w-10 h-auto rounded-sm shadow-sm"
            />
          )}
          <span className="text-sm font-semibold text-center">
            {match.away_team?.name ?? 'A definir'}
          </span>
        </div>
      </div>

      {/* Venue */}
      <p className="text-xs text-center text-gray-400">{match.venue}</p>

      {/* Bet section */}
      
        <div className="border-t pt-2 text-xs text-center text-gray-600">
          Sua aposta:{' '}
          <span className="font-semibold">
            {myBet?.home_score_bet ?? '-'} x {myBet?.away_score_bet ?? '-'}
          </span>
          <span className="ml-2 badge badge-blue">{myBet?.points_earned ?? 0} pts</span>
        </div>
      

      {onBet && match.status === 'scheduled' && bettingOpen && (
        <button
          onClick={() => onBet(match)}
          className="btn-outline w-full text-xs py-1.5"
        >
          {myBet ? '✏️ Editar aposta' : '+ Apostar'}
        </button>
      )}
    </div>
  )
}
