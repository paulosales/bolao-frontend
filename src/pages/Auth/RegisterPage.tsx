import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useRedux'
import { register as registerAction } from '../../store/authSlice'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { toast } from 'react-toastify'

interface FormValues {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const { loading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>()

  const password = watch('password')

  async function onSubmit(data: FormValues) {
    const payload: { name: string; password: string; email?: string; phone?: string } = {
      name: data.name,
      password: data.password,
    }
    if (data.email) payload.email = data.email
    if (data.phone) payload.phone = data.phone

    const result = await dispatch(registerAction(payload))
    if (registerAction.fulfilled.match(result)) {
      navigate('/dashboard')
    } else {
      toast.error((result.payload as string) ?? 'Erro ao cadastrar')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="card w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Criar Conta</h1>
          <p className="text-sm text-gray-500 mt-1">Participe do Bolão da Copa 2026</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            placeholder="Seu nome"
            error={errors.name?.message}
            {...register('name', { required: 'Obrigatório' })}
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            hint="Informe e-mail e/ou telefone"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Telefone"
            type="tel"
            placeholder="+5511999998888"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Obrigatório',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
          />
          <Input
            label="Confirmar senha"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Obrigatório',
              validate: (v) => v === password || 'Senhas não coincidem',
            })}
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Criar conta
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary-600 hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
