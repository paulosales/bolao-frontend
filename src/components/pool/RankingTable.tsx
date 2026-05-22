import { useState } from 'react'
import { RankingEntry } from '../../types'

interface Props {
  ranking: RankingEntry[]
  currentUserId: string | undefined
}

export default function RankingTable({ ranking, currentUserId }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  function toggle(userId: string) {
    setExpanded((prev) => (prev === userId ? null : userId))
  }

  if (ranking.length === 0) {
    return (
      <div className="card p-6 text-center text-gray-500 text-sm">
        Nenhuma aposta registrada ainda.
      </div>
    )
  }

  const medalMap: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="py-3 px-3 sm:px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-10 sm:w-12">
              #
            </th>
            <th className="py-3 px-3 sm:px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Participante
            </th>
            <th className="py-3 px-3 sm:px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide w-20 sm:w-24">
              Pts
            </th>
            <th className="w-8 sm:w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ranking.map((entry) => {
            const isSelf = entry.user_id === currentUserId
            const isOpen = expanded === entry.user_id

            return (
              <>
                <tr
                  key={entry.user_id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    isSelf ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => toggle(entry.user_id)}
                >
                  <td className="py-3 px-3 sm:px-4 font-semibold text-gray-700">
                    {medalMap[entry.position] ?? entry.position}
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-medium text-gray-900">
                    <span className="block truncate max-w-[150px] sm:max-w-none">
                      {entry.user_name}
                    </span>
                    {isSelf && (
                      <span className="badge badge-blue">Você</span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right font-bold text-primary-700 whitespace-nowrap">
                    {entry.total_points} pts
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-center text-gray-400 text-xs">
                    {isOpen ? '▲' : '▼'}
                  </td>
                </tr>

                {isOpen && (
                  <tr key={`${entry.user_id}-bets`} className="bg-gray-50">
                    <td colSpan={4} className="px-3 sm:px-4 py-3">
                      {entry.bets.length === 0 ? (
                        <p className="text-xs text-gray-500">Sem apostas ainda.</p>
                      ) : (
                        <div className="overflow-x-auto -mx-1">
                          <table className="w-full text-xs min-w-[280px]">
                            <thead>
                              <tr className="text-gray-500">
                                <th className="text-left pb-1 pr-2">Jogo</th>
                                <th className="text-center pb-1 px-1">Aposta</th>
                                <th className="text-center pb-1 px-1">Resultado</th>
                                <th className="text-right pb-1">Pts</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {entry.bets.map((bet) => (
                                <tr key={bet.match_id}>
                                  <td className="py-1 pr-2 truncate max-w-[100px]">
                                    {bet.home_team ?? '?'} x {bet.away_team ?? '?'}
                                  </td>
                                  <td className="py-1 text-center px-1 whitespace-nowrap">
                                    {bet.home_score_bet} x {bet.away_score_bet}
                                  </td>
                                  <td className="py-1 text-center px-1 whitespace-nowrap">
                                    {bet.actual_home !== null && bet.actual_away !== null
                                      ? `${bet.actual_home} x ${bet.actual_away}`
                                      : '—'}
                                  </td>
                                  <td className="py-1 text-right font-semibold text-primary-700 whitespace-nowrap">
                                    {bet.points_earned !== null ? `${bet.points_earned}` : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}
