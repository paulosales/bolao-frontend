import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux'
import { fetchPool } from '../../store/poolSlice'
import { poolService } from '../../services/poolService'
import { PoolRule } from '../../types'
import Loading from '../../components/common/Loading'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { toast } from 'react-toastify'

interface FormValues {
  exact_score_points: number
  one_team_score_points: number
  draw_points: number
  goal_difference_points: number
  winner_points: number
  description: string
}

export default function PoolRulesPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentPool } = useAppSelector((s) => s.pool)
  const [rules, setRules] = useState<PoolRule | null>(null)
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>()

  useEffect(() => {
    async function load() {
      if (!id) return
      await dispatch(fetchPool(id))
      try {
        const r = await poolService.getRules(id)
        setRules(r)
        reset({
          exact_score_points: r.exact_score_points,
          one_team_score_points: r.one_team_score_points,
          draw_points: r.draw_points,
          goal_difference_points: r.goal_difference_points,
          winner_points: r.winner_points,
          description: r.description ?? '',
        })
      } catch {
        toast.error('Erro ao carregar regras')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [dispatch, id, reset])

  async function onSubmit(data: FormValues) {
    if (!id) return
    try {
      await poolService.updateRules(id, {
        exact_score_points: Number(data.exact_score_points),
        one_team_score_points: Number(data.one_team_score_points),
        draw_points: Number(data.draw_points),
        goal_difference_points: Number(data.goal_difference_points),
        winner_points: Number(data.winner_points),
        description: data.description || undefined,
      })
      toast.success('Regras atualizadas!')
    } catch {
      toast.error('Erro ao salvar regras')
    }
  }

  async function handleAccept() {
    if (!id) return
    try {
      await poolService.acceptRules(id)
      toast.success('Regras aceitas!')
      navigate(`/pools/${id}`)
    } catch {
      toast.error('Erro ao aceitar regras')
    }
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Regras de Pontuação</h1>
      <p className="text-sm text-gray-500 mb-6">{currentPool?.name}</p>

      {rules?.description && (
        <div className="card p-4 mb-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">{rules.description}</p>
        </div>
      )}

      <div className="card p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Placar exato"
            type="number"
            min={0}
            hint="Pontos por acertar o placar exato"
            {...register('exact_score_points')}
            disabled={!currentPool?.is_creator}
          />
          <Input
            label="Gols de um time"
            type="number"
            min={0}
            hint="Pontos por acertar o número de gols de ao menos um time"
            {...register('one_team_score_points')}
            disabled={!currentPool?.is_creator}
          />
          <Input
            label="Empate"
            type="number"
            min={0}
            hint="Pontos por acertar empate corretamente"
            {...register('draw_points')}
            disabled={!currentPool?.is_creator}
          />
          <Input
            label="Diferença de gols"
            type="number"
            min={0}
            hint="Pontos por acertar a diferença de gols"
            {...register('goal_difference_points')}
            disabled={!currentPool?.is_creator}
          />
          <Input
            label="Time ganhador"
            type="number"
            min={0}
            hint="Pontos por acertar o time vencedor (ou empate como resultado)"
            {...register('winner_points')}
            disabled={!currentPool?.is_creator}
          />
          {currentPool?.is_creator ? (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Descrição / observações</label>
                <textarea
                  className="input min-h-[80px] resize-y"
                  placeholder="Regras adicionais..."
                  {...register('description')}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={() => navigate(`/pools/${id}`)}>
                  Voltar
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  Salvar regras
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-end">
              <Button type="button" variant="secondary" onClick={() => navigate(`/pools/${id}`)}>
                Voltar
              </Button>
            </div>
          )}
        </form>

        {!currentPool?.accepted_rules && (
          <div className="mt-4 pt-4 border-t">
            <Button onClick={handleAccept} className="w-full" variant="success">
              ✓ Aceitar regras e participar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
