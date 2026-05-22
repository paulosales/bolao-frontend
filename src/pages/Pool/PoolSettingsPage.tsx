import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { fetchPool } from '../../store/poolSlice'
import { poolService } from '../../services/poolService'
import Loading from '../../components/common/Loading'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { toast } from 'react-toastify'

interface FormValues {
  name: string
  quota_value: string
  estimated_prize: string
  bet_visibility: string
}

export default function PoolSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentPool, loading } = useAppSelector((s) => s.pool)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>()

  useEffect(() => {
    if (id) dispatch(fetchPool(id))
  }, [dispatch, id])

  useEffect(() => {
    if (currentPool) {
      reset({
        name: currentPool.name,
        quota_value: currentPool.quota_value?.toString() ?? '',
        estimated_prize: currentPool.estimated_prize?.toString() ?? '',
        bet_visibility: currentPool.bet_visibility,
      })
    }
  }, [currentPool, reset])

  async function onSubmit(data: FormValues) {
    if (!id) return
    try {
      await poolService.updatePool(id, {
        name: data.name,
        quota_value: data.quota_value ? Number(data.quota_value) : undefined,
        estimated_prize: data.estimated_prize ? Number(data.estimated_prize) : undefined,
        bet_visibility: data.bet_visibility,
      })
      toast.success('Configurações salvas!')
      dispatch(fetchPool(id))
    } catch {
      toast.error('Erro ao salvar configurações')
    }
  }

  if (loading || !currentPool) return <Loading />

  if (!currentPool.is_creator) {
    navigate(`/pools/${id}`)
    return null
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Configurações do Bolão</h1>
      <div className="card p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nome do bolão"
            required
            error={errors.name?.message}
            {...register('name', { required: 'Obrigatório' })}
          />
          <Input
            label="Valor da cota (R$)"
            type="number"
            min={0}
            step="0.01"
            error={errors.quota_value?.message}
            {...register('quota_value')}
          />
          <Input
            label="Prêmio estimado (R$)"
            type="number"
            min={0}
            step="0.01"
            error={errors.estimated_prize?.message}
            {...register('estimated_prize')}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Visibilidade das apostas</label>
            <select className="input" {...register('bet_visibility')}>
              <option value="before_start">Sempre visível</option>
              <option value="during_match">Apenas após o jogo começar</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button type="button" variant="secondary" onClick={() => navigate(`/pools/${id}`)}>
              Voltar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
