import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Match, Bet } from '../../types'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Input from '../common/Input'
import { flagUrl } from '../../utils/scoreUtils'
import { useAppDispatch } from '../../hooks/useRedux'
import { placeBet } from '../../store/betSlice'
import { toast } from 'react-toastify'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  match: Match
  poolId: string
  existingBet?: Bet
}

interface FormValues {
  home_score_bet: number
  away_score_bet: number
}

export default function BetForm({ open, onClose, onSuccess, match, poolId, existingBet }: Props) {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      home_score_bet: existingBet?.home_score_bet ?? 0,
      away_score_bet: existingBet?.away_score_bet ?? 0,
    },
  })

  // Re-populate form if existingBet loads after mount (e.g. data fetched after modal opens)
  useEffect(() => {
    if (existingBet) {
      reset({
        home_score_bet: existingBet.home_score_bet,
        away_score_bet: existingBet.away_score_bet,
      })
    }
  }, [existingBet, reset])

  async function onSubmit(data: FormValues) {
    const result = await dispatch(
      placeBet({
        poolId,
        matchId: match.id,
        home_score_bet: Number(data.home_score_bet),
        away_score_bet: Number(data.away_score_bet),
      })
    )
    if (placeBet.fulfilled.match(result)) {
      toast.success('Aposta salva!')
      onClose()
      onSuccess?.()
    } else {
      toast.error((result.payload as string) ?? 'Erro ao salvar aposta')
    }
  }

  const homeFlag = match.home_team
    ? (match.home_team as any).flag_url || ((match.home_team as any).short_name ? `https://flagcdn.com/w80/${(match.home_team as any).short_name.toLowerCase()}.png` : null)
    : null
  const awayFlag = match.away_team
    ? (match.away_team as any).flag_url || ((match.away_team as any).short_name ? `https://flagcdn.com/w80/${(match.away_team as any).short_name.toLowerCase()}.png` : null)
    : null

  return (
    <Modal open={open} onClose={onClose} title="Fazer Aposta" size="sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex flex-col items-center gap-1 flex-1">
          {homeFlag && <img src={homeFlag} alt="" className="w-10 h-auto" />}
          <span className="text-sm font-semibold text-center">
            {match.home_team?.name ?? 'Casa'}
          </span>
        </div>
        <span className="text-lg font-bold text-gray-400">X</span>
        <div className="flex flex-col items-center gap-1 flex-1">
          {awayFlag && <img src={awayFlag} alt="" className="w-10 h-auto" />}
          <span className="text-sm font-semibold text-center">
            {match.away_team?.name ?? 'Visitante'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Input
            type="number"
            min={0}
            max={99}
            label={match.home_team?.name ?? 'Casa'}
            error={errors.home_score_bet?.message}
            {...register('home_score_bet', {
              required: 'Obrigatório',
              min: { value: 0, message: 'Mín 0' },
            })}
          />
          <span className="text-xl font-bold text-gray-400 pt-5">x</span>
          <Input
            type="number"
            min={0}
            max={99}
            label={match.away_team?.name ?? 'Visitante'}
            error={errors.away_score_bet?.message}
            {...register('away_score_bet', {
              required: 'Obrigatório',
              min: { value: 0, message: 'Mín 0' },
            })}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Salvar aposta
          </Button>
        </div>
      </form>
    </Modal>
  )
}
