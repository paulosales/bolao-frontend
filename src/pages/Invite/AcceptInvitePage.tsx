import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { invitationService } from '../../services/invitationService'
import { useAppDispatch } from '../../hooks/useRedux'
import { setToken, setUser } from '../../store/authSlice'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Loading from '../../components/common/Loading'
import { toast } from 'react-toastify'

interface InvitationDetail {
  pool: { id: string; name: string; code: string }
  rules: {
    exact_score_points: number
    one_team_score_points: number
    draw_points: number
    goal_difference_points: number
    description: string | null
  }
  inviter_name: string
  invitee_email: string | null
}

interface FormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<InvitationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const password = watch('password')

  useEffect(() => {
    async function load() {
      if (!token) return
      try {
        const d = await invitationService.getByToken(token)
        setDetail(d)
      } catch {
        setError('Convite inválido ou expirado.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  async function onSubmit(data: FormValues) {
    if (!token) return
    try {
      const res = await invitationService.accept(token, {
        name: data.name,
        password: data.password,
        email: data.email || undefined,
      })
      dispatch(setToken(res.token))
      dispatch(setUser({ ...res.user, created_at: '' }))
      toast.success(`Bem-vindo ao ${detail?.pool.name}!`)
      navigate(`/pools/${detail?.pool.id}`)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      toast.error(e.response?.data?.message ?? 'Erro ao aceitar convite')
    }
  }

  if (loading) return <Loading fullPage />

  if (error || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center max-w-sm">
          <span className="text-4xl">❌</span>
          <p className="text-red-600 mt-4 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-6">
          <span className="text-4xl">⚽</span>
          <h1 className="text-xl font-bold text-gray-900 mt-2">
            Você foi convidado!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            <strong>{detail.inviter_name}</strong> te convidou para o bolão{' '}
            <strong>{detail.pool.name}</strong>
          </p>
        </div>

        {/* Rules summary */}
        <div className="card p-4 mb-6 bg-blue-50 border-blue-200 text-sm text-blue-900">
          <p className="font-semibold mb-2">Regras de pontuação:</p>
          <ul className="space-y-1 text-xs">
            <li>🎯 Placar exato: <strong>{detail.rules.exact_score_points} pts</strong></li>
            <li>⚽ Gols de um time: <strong>{detail.rules.one_team_score_points} pts</strong></li>
            <li>🤝 Empate certo: <strong>{detail.rules.draw_points} pts</strong></li>
            <li>📊 Diferença de gols: <strong>{detail.rules.goal_difference_points} pts</strong></li>
          </ul>
          {detail.rules.description && (
            <p className="mt-2 text-xs text-blue-700">{detail.rules.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Seu nome"
            required
            error={errors.name?.message}
            {...register('name', { required: 'Obrigatório' })}
          />
          <Input
            label="E-mail"
            type="email"
            defaultValue={detail.invitee_email ?? ''}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Senha"
            type="password"
            required
            error={errors.password?.message}
            {...register('password', {
              required: 'Obrigatório',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
          />
          <Input
            label="Confirmar senha"
            type="password"
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Obrigatório',
              validate: (v) => v === password || 'Senhas não coincidem',
            })}
          />

          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Aceitar convite e entrar
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Já tem conta?{' '}
          <a href="/login" className="text-primary-600 hover:underline">
            Entre aqui
          </a>
        </p>
      </div>
    </div>
  )
}
