import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { authService } from '../../services/authService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

interface FormValues {
  email: string
}

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  async function onSubmit(data: FormValues) {
    setLoading(true)
    try {
      await authService.forgotPassword(data.email)
      setSent(true)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ?? 'Erro ao enviar e-mail. Tente novamente.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-sm p-6 sm:p-8">
        <div className="text-center mb-8">
          <span className="text-5xl">🔑</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Esqueci minha senha</h1>
          <p className="text-sm text-gray-500 mt-1">
            Informe seu e-mail para receber um link de redefinição.
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
              ✅ E-mail enviado! Verifique sua caixa de entrada e siga as instruções para redefinir
              sua senha. O link expira em 1 hora.
            </p>
            <Link to="/login" className="block text-sm text-primary-600 hover:underline font-medium">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Obrigatório',
                pattern: { value: /\S+@\S+\.\S+/, message: 'E-mail inválido' },
              })}
            />

            <Button type="submit" loading={loading} className="w-full mt-2">
              Enviar link de redefinição
            </Button>

            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-primary-600 hover:underline font-medium">
                Voltar para o login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
