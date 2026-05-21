interface LoadingProps {
  text?: string
  fullPage?: boolean
}

export default function Loading({ text = 'Carregando...', fullPage = false }: LoadingProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return <div className="py-12 flex justify-center">{spinner}</div>
}
