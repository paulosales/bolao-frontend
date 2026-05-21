import { format, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatMatchDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr)
    if (!isValid(d)) return dateStr
    return format(d, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr)
    if (!isValid(d)) return dateStr
    return format(d, 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function isBeforeNow(dateStr: string): boolean {
  try {
    const d = parseISO(dateStr)
    return isValid(d) && d < new Date()
  } catch {
    return false
  }
}
