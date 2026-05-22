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
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{currentPool.name}</h1>
            <p className="text-sm text-gray-500 font-mono mt-1">#{currentPool.code}</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
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

        {/* Prize summary */}
        {(() => {
          const prize = ranking?.prizes?.total ?? currentPool.total_prize ?? 0
          if (prize <= 0) return null
          const pct1 = ranking?.prizes?.pct_1st ?? 60
          const pct2 = ranking?.prizes?.pct_2nd ?? 30
          const pct3 = ranking?.prizes?.pct_3rd ?? 10
          const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          return (
            <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs text-green-600 font-medium">💰 Prêmio total</p>
                <p className="text-xl font-black text-green-800">{fmt(prize)}</p>
              </div>
              <div className="flex gap-3 ml-auto flex-wrap">
                <div className="text-center">
                  <p className="text-lg">🥇</p>
                  <p className="text-xs font-bold text-green-800">{fmt(prize * pct1 / 100)}</p>
                  <p className="text-xs text-green-600">{pct1}%</p>
                </div>
                <div className="text-center">
                  <p className="text-lg">🥈</p>
                  <p className="text-xs font-bold text-green-800">{fmt(prize * pct2 / 100)}</p>
                  <p className="text-xs text-green-600">{pct2}%</p>
                </div>
                <div className="text-center">
                  <p className="text-lg">🥉</p>
                  <p className="text-xs font-bold text-green-800">{fmt(prize * pct3 / 100)}</p>
                  <p className="text-xs text-green-600">{pct3}%</p>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Accept Rules Banner */}
      {!currentPool.accepted_rules && (
        <div className="card p-4 mb-4 bg-yellow-50 border-yellow-300 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm text-yellow-800 flex-1">
            ⚠️ Você precisa aceitar as regras do bolão para apostar.
          </p>
          <div className="flex gap-2 shrink-0">
            <Link to={`/pools/${id}/rules`} className="text-xs text-yellow-700 underline self-center">
              Ver regras
            </Link>
            <button
              onClick={handleAcceptRules}
              disabled={acceptingRules}
              className="btn-success text-xs py-1.5 px-3"
            >
              Aceitar
            </button>
          </div>
        </div>
      )}

      {/* Champion Banner */}
      {ranking?.is_finished && ranking.champion && (
        <div className="mb-6">
          <ChampionAnnouncement champion={ranking.champion} prize={ranking.prizes} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {(['ranking', 'matches'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
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
            <RankingTable ranking={ranking?.ranking ?? []} currentUserId={user?.id} prizes={ranking?.prizes} />
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
