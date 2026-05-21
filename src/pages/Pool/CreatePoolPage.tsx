import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useRedux'
import { createPool } from '../../store/poolSlice'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { toast } from 'react-toastify'

interface FormValues {
  name: string
  quota_value: string
  estimated_prize: string
  bet_visibility: string
}

export default function CreatePoolPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { bet_visibility: 'during_match' } })

  async function onSubmit(data: FormValues) {
    const result = await dispatch(
      createPool({
        name: data.name,
        quota_value: data.quota_value ? Number(data.quota_value) : undefined,
        estimated_prize: data.estimated_prize ? Number(data.estimated_prize) : undefined,
      })
    )
    if (createPool.fulfilled.match(result)) {
      toast.success('Bolão criado!')
      navigate(`/pools/${result.payload.id}`)
    } else {
      toast.error('Erro ao criar bolão')
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Criar Novo Bolão</h1>
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nome do bolão"
            placeholder="Ex: Bolão do Trabalho 2026"
            required
            error={errors.name?.message}
            {...register('name', { required: 'Obrigatório' })}
          />
          <Input
            label="Valor da cota (R$)"
            type="number"
            min={0}
            step="0.01"
            placeholder="50.00"
            hint="Opcional — apenas informativo"
            error={errors.quota_value?.message}
            {...register('quota_value')}
          />
          <Input
            label="Prêmio estimado (R$)"
            type="number"
            min={0}
            step="0.01"
            placeholder="500.00"
            hint="Opcional — exibido no ranking final"
            error={errors.estimated_prize?.message}
            {...register('estimated_prize')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Visibilidade das apostas</label>
            <select
              className="input"
              {...register('bet_visibility')}
            >
              <option value="always">Sempre visível</option>
              <option value="during_match">Apenas após o jogo começar</option>
              <option value="never">Nunca (somente criador)</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Criar bolão
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
