import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { fetchPool } from '../../store/poolSlice'
import { fetchRanking } from '../../store/rankingSlice'
import { fetchMyBets } from '../../store/betSlice'
import { fetchMatches } from '../../store/matchSlice'
import { useAuth } from '../../hooks/useAuth'
import Loading from '../../components/common/Loading'
import RankingTable from '../../components/pool/RankingTable'
import MatchCard from '../../components/pool/MatchCard'
import BetForm from '../../components/pool/BetForm'
import ChampionAnnouncement from '../../components/pool/ChampionAnnouncement'
import InviteModal from '../../components/pool/InviteModal'
import { poolService } from '../../services/poolService'
import { Match } from '../../types'
import { toast } from 'react-toastify'

export default function PoolDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { user } = useAuth()

  const { currentPool, loading: poolLoading } = useAppSelector((s) => s.pool)
  const { data: ranking, loading: rankingLoading } = useAppSelector((s) => s.ranking)
  const { myBets } = useAppSelector((s) => s.bet)
  const { matches } = useAppSelector((s) => s.match)

  const [tab, setTab] = useState<'ranking' | 'matches'>('ranking')
  const [betMatch, setBetMatch] = useState<Match | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [acceptingRules, setAcceptingRules] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchPool(id))
      dispatch(fetchRanking(id))
      dispatch(fetchMyBets(id))
      dispatch(fetchMatches())
    }
  }, [dispatch, id])

  async function handleAcceptRules() {
    if (!id) return
    setAcceptingRules(true)
    try {
      await poolService.acceptRules(id)
      dispatch(fetchPool(id))
      toast.success('Regras aceitas!')
    } catch {
      toast.error('Erro ao aceitar regras')
    } finally {
      setAcceptingRules(false)
    }
  }

  if (poolLoading || !currentPool) return <Loading />

  const myBetMap = Object.fromEntries(myBets.map((b) => [b.match_id, b]))
  const groupMatches = matches.filter((m) => m.stage === 'group')

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentPool.name}</h1>
          <p className="text-sm text-gray-500 font-mono mt-1">#{currentPool.code}</p>
        </div>
        <div className="flex gap-2">
          {currentPool.is_creator && (
            <Link to={`/pools/${id}/settings`} className="btn-secondary text-sm">
              ⚙️ Configurar
            </Link>
          )}
          <Link to={`/pools/${id}/rules`} className="btn-secondary text-sm">
            📋 Regras
          </Link>
          <button onClick={() => setInviteOpen(true)} className="btn-primary text-sm">
            + Convidar
          </button>
        </div>
      </div>

      {/* Accept Rules Banner */}
      {!currentPool.accepted_rules && (
        <div className="card p-4 mb-4 bg-yellow-50 border-yellow-300 flex items-center justify-between gap-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Você precisa aceitar as regras do bolão para apostar.
          </p>
          <div className="flex gap-2">
            <Link to={`/pools/${id}/rules`} className="text-xs text-yellow-700 underline">
              Ver regras
            </Link>
            <button
              onClick={handleAcceptRules}
              disabled={acceptingRules}
              className="btn-success text-xs py-1 px-3"
            >
              Aceitar
            </button>
          </div>
        </div>
      )}

      {/* Champion Banner */}
      {ranking?.is_finished && ranking.champion && (
        <div className="mb-6">
          <ChampionAnnouncement champion={ranking.champion} prize={ranking.prize} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {(['ranking', 'matches'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'ranking' ? '🏅 Ranking' : '⚽ Jogos'}
          </button>
        ))}
      </div>

      {/* Ranking Tab */}
      {tab === 'ranking' && (
        <>
          {rankingLoading ? (
            <Loading />
          ) : (
            <RankingTable ranking={ranking?.ranking ?? []} currentUserId={user?.id} />
          )}
        </>
      )}

      {/* Matches Tab */}
      {tab === 'matches' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupMatches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              myBet={myBetMap[m.id]}
              onBet={currentPool.accepted_rules ? (match) => setBetMatch(match) : undefined}
              bettingOpen={currentPool.accepted_rules}
            />
          ))}
        </div>
      )}

      {/* Bet Form Modal */}
      {betMatch && id && (
        <BetForm
          open
          onClose={() => setBetMatch(null)}
          onSuccess={() => {
            setBetMatch(null)
            dispatch(fetchMyBets(id))
          }}
          match={betMatch}
          poolId={id}
          existingBet={myBetMap[betMatch.id]}
        />
      )}

      {/* Invite Modal */}
      {id && (
        <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} poolId={id} />
      )}
    </div>
  )
}
