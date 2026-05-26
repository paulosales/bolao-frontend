import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { authService } from '../../services/authService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

interface FormValues {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>()

  async function onSubmit(data: FormValues) {
    if (!token) {
      toast.error('Link inválido.')
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(token, data.password)
      toast.success('Senha redefinida com sucesso! Faça login.')
      navigate('/login')
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Erro ao redefinir senha. O link pode ter expirado.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-sm p-6 sm:p-8">
        <div className="text-center mb-8">
          <span className="text-5xl">🔐</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Nova senha</h1>
          <p className="text-sm text-gray-500 mt-1">Defina uma nova senha para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nova senha"
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
              validate: (v) => v === watch('password') || 'As senhas não coincidem',
            })}
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Redefinir senha
          </Button>

          <p className="text-center text-sm text-gray-500">
            <Link to="/login" className="text-primary-600 hover:underline font-medium">
              Voltar para o login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
