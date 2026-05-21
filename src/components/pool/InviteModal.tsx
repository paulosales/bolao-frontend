import { useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Input from '../common/Input'
import { poolService } from '../../services/poolService'
import { toast } from 'react-toastify'

interface Props {
  open: boolean
  onClose: () => void
  poolId: string
}

type InviteMode = 'email' | 'link'

export default function InviteModal({ open, onClose, poolId }: Props) {
  const [mode, setMode] = useState<InviteMode>('email')
  const [value, setValue] = useState('')
  const [link, setLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (mode === 'link') {
      setLoading(true)
      try {
        const res = await poolService.generateInviteLink(poolId)
        setLink(res.link)
      } catch {
        toast.error('Erro ao gerar link')
      } finally {
        setLoading(false)
      }
      return
    }

    if (!value.trim()) {
      toast.error('Informe o e-mail')
      return
    }

    setLoading(true)
    try {
      await poolService.inviteByEmail(poolId, value.trim())
      toast.success('Convite enviado!')
      setValue('')
      onClose()
    } catch {
      toast.error('Erro ao enviar convite')
    } finally {
      setLoading(false)
    }
  }

  function copyLink() {
    if (link) {
      navigator.clipboard.writeText(link).then(() => toast.success('Link copiado!'))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Convidar Participante" size="sm">
      <div className="flex gap-2 mb-4">
        {(['email', 'link'] as InviteMode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setLink(null) }}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium border transition-colors ${
              mode === m
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {m === 'email' ? '📧 E-mail' : '🔗 Link'}
          </button>
        ))}
      </div>

      {mode !== 'link' && (
        <Input
          label="E-mail do convidado"
          type="email"
          placeholder="amigo@email.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      {link && (
        <div className="mt-3 p-2 bg-gray-100 rounded-lg text-xs break-all text-gray-700">
          {link}
        </div>
      )}

      <div className="flex gap-2 mt-4 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
        {link ? (
          <Button onClick={copyLink}>Copiar link</Button>
        ) : (
          <Button loading={loading} onClick={handleSend}>
            {mode === 'link' ? 'Gerar link' : 'Enviar convite'}
          </Button>
        )}
      </div>
    </Modal>
  )
}
