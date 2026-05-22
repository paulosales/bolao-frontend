import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { invitationService } from '../../services/invitationService'
import { useAppDispatch } from '../../hooks/useRedux'
import { login, setToken, setUser } from '../../store/authSlice'
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

interface RegisterValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface LoginValues {
  login: string
  password: string
}

export default function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<InvitationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'register' | 'login'>('register')

  const registerForm = useForm<RegisterValues>()
  const loginForm = useForm<LoginValues>()

  const password = registerForm.watch('password')

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

  async function onRegister(data: RegisterValues) {
    if (!token) return
    try {
      const res = await invitationService.accept(token, {
        name: data.name,
        password: data.password,
        email: data.email || undefined,
      })
      dispatch(setToken(res.token))
      dispatch(setUser({ ...res.user, created_at: '', phone: '' }))
      toast.success(`Bem-vindo ao ${detail?.pool.name}!`)
      navigate(`/pools/${detail?.pool.id}`)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      toast.error(e.response?.data?.error ?? 'Erro ao aceitar convite')
    }
  }

  async function onLogin(data: LoginValues) {
    if (!token) return
    const result = await dispatch(login({ login: data.login, password: data.password }))
    if (!login.fulfilled.match(result)) {
      toast.error((result.payload as string) ?? 'Erro ao entrar')
      return
    }
    try {
      const { pool_id } = await invitationService.join(token)
      toast.success(`Bem-vindo ao ${detail?.pool.name}!`)
      navigate(`/pools/${pool_id}`)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      toast.error(e.response?.data?.error ?? 'Erro ao entrar no bolão')
    }
  }

  if (loading) return <Loading fullPage />

  if (error || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-6 text-center max-w-sm">
          <span className="text-4xl">❌</span>
          <p className="text-red-600 mt-4 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="card w-full max-w-md p-5 sm:p-8">
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

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium border transition-colors ${
              mode === 'register'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Criar conta
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium border transition-colors ${
              mode === 'login'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Já tenho conta
          </button>
        </div>

        {mode === 'register' ? (
          <form onSubmit={registerForm.handleSubmit(onRegister)} className="flex flex-col gap-4">
            <Input
              label="Seu nome"
              required
              error={registerForm.formState.errors.name?.message}
              {...registerForm.register('name', { required: 'Obrigatório' })}
            />
            <Input
              label="E-mail"
              type="email"
              defaultValue={detail.invitee_email ?? ''}
              error={registerForm.formState.errors.email?.message}
              {...registerForm.register('email')}
            />
            <Input
              label="Senha"
              type="password"
              required
              error={registerForm.formState.errors.password?.message}
              {...registerForm.register('password', {
                required: 'Obrigatório',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />
            <Input
              label="Confirmar senha"
              type="password"
              required
              error={registerForm.formState.errors.confirmPassword?.message}
              {...registerForm.register('confirmPassword', {
                required: 'Obrigatório',
                validate: (v) => v === password || 'Senhas não coincidem',
              })}
            />
            <Button
              type="submit"
              loading={registerForm.formState.isSubmitting}
              className="w-full mt-2"
            >
              Criar conta e entrar
            </Button>
          </form>
        ) : (
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              defaultValue={detail.invitee_email ?? ''}
              error={loginForm.formState.errors.login?.message}
              {...loginForm.register('login', { required: 'Obrigatório' })}
            />
            <Input
              label="Senha"
              type="password"
              required
              error={loginForm.formState.errors.password?.message}
              {...loginForm.register('password', { required: 'Obrigatório' })}
            />
            <Button
              type="submit"
              loading={loginForm.formState.isSubmitting}
              className="w-full mt-2"
            >
              Entrar e aceitar convite
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
