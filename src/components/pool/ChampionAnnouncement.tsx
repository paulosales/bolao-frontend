import { RankingEntry } from '../../types'

interface Props {
  champion: RankingEntry
  prize: number | null
}

export default function ChampionAnnouncement({ champion, prize }: Props) {
  return (
    <div className="card p-8 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="text-2xl font-bold text-yellow-800 mb-1">Campeão do Bolão!</h2>
      <p className="text-4xl font-black text-yellow-900 mb-2">{champion.user_name}</p>
      <p className="text-xl font-semibold text-yellow-700 mb-4">
        {champion.total_points} pontos
      </p>
      {prize && (
        <p className="text-lg text-yellow-800">
          Prêmio:{' '}
          <span className="font-bold">
            {prize.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </p>
      )}
    </div>
  )
}
