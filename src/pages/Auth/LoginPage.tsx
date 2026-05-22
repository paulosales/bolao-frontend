import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useRedux'
import { login } from '../../store/authSlice'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { toast } from 'react-toastify'

interface FormValues {
  login: string
  password: string
}

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  async function onSubmit(data: FormValues) {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      navigate('/dashboard')
    } else {
      toast.error((result.payload as string) ?? 'Erro ao entrar')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-sm p-6 sm:p-8">
        <div className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Bolão da Copa</h1>
          <p className="text-sm text-gray-500 mt-1">Entre na sua conta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="E-mail ou telefone"
            type="text"
            placeholder="seu@email.com"
            error={errors.login?.message}
            {...register('login', { required: 'Obrigatório' })}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Obrigatório' })}
          />

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <Button type="submit" loading={loading} className="w-full mt-2">
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Não tem conta?{' '}
          <Link to="/register" className="text-primary-600 hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
