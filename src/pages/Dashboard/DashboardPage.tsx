import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { fetchMyPools } from '../../store/poolSlice'
import { useAuth } from '../../hooks/useAuth'
import Loading from '../../components/common/Loading'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { pools, loading } = useAppSelector((s) => s.pool)
  const { user } = useAuth()

  useEffect(() => {
    dispatch(fetchMyPools())
  }, [dispatch])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meus Bolões</h1>
          <p className="text-sm text-gray-500 mt-1">Olá, {user?.name}! 👋</p>
        </div>
        <Link to="/pools/create" className="btn-primary w-full sm:w-auto text-center">
          + Novo Bolão
        </Link>
      </div>

      {loading && <Loading />}

      {!loading && pools.length === 0 && (
        <div className="card p-12 text-center">
          <span className="text-5xl">⚽</span>
          <p className="text-gray-500 mt-4">Você ainda não participa de nenhum bolão.</p>
          <Link to="/pools/create" className="btn-primary mt-4 inline-flex">
            Criar meu primeiro bolão
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pools?.map((pool) => (
          <Link key={pool.id} to={`/pools/${pool.id}`} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h2 className="font-semibold text-gray-900 text-lg leading-tight">{pool.name}</h2>
              {pool.is_creator && <span className="badge badge-yellow ml-2">Criador</span>}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👥 {pool.member_count ?? 0} participantes</span>
              {pool.quota_value ? (
                <span>
                  💵{' '}
                  {pool.quota_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / cota
                </span>
              ) : null}
            </div>
            {(pool.total_prize ?? 0) > 0 && (
              <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <span className="text-green-700 text-base">🏆</span>
                <div>
                  <p className="text-xs text-green-600 font-medium">Prêmio acumulado</p>
                  <p className="text-sm font-bold text-green-800">
                    {(pool.total_prize!).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                {(pool.paid_count ?? 0) > 0 && (
                  <span className="ml-auto text-xs text-green-600">
                    {pool.paid_count}/{pool.member_count} pagos
                  </span>
                )}
              </div>
            )}
            {pool.is_finished && (
              <span className="badge badge-blue mt-3 inline-flex">Encerrado</span>
            )}
            <p className="text-xs text-gray-400 mt-3 font-mono">#{pool.code}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
