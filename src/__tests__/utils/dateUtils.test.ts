import { describe, it, expect } from 'vitest'
import { formatMatchDate, formatShortDate, isBeforeNow } from '../../utils/dateUtils'

describe('formatMatchDate', () => {
  it('returns the raw string for an invalid date', () => {
    expect(formatMatchDate('not-a-date')).toBe('not-a-date')
  })

  it('returns the raw string for an empty string', () => {
    expect(formatMatchDate('')).toBe('')
  })

  it('transforms a valid ISO date and includes the month name', () => {
    const result = formatMatchDate('2026-06-14T12:00:00')
    expect(result).not.toBe('2026-06-14T12:00:00')
    expect(result).toContain('junho')
  })

  it('includes the day number for a valid date', () => {
    const result = formatMatchDate('2026-06-14T12:00:00')
    expect(result).toContain('14')
  })
})

describe('formatShortDate', () => {
  it('returns the raw string for an invalid date', () => {
    expect(formatShortDate('invalid')).toBe('invalid')
  })

  it('formats a valid date as dd/MM/yyyy', () => {
    // Use noon to avoid any UTC offset shifting the day
    const result = formatShortDate('2026-06-14T12:00:00')
    expect(result).toBe('14/06/2026')
  })

  it('formats a different valid date correctly', () => {
    const result = formatShortDate('2026-11-21T12:00:00')
    expect(result).toBe('21/11/2026')
  })
})

describe('isBeforeNow', () => {
  it('returns true for a clearly past date', () => {
    expect(isBeforeNow('2000-01-01T00:00:00')).toBe(true)
  })

  it('returns false for a clearly future date', () => {
    expect(isBeforeNow('2099-12-31T23:59:59')).toBe(false)
  })

  it('returns false for an invalid date string', () => {
    expect(isBeforeNow('not-a-date')).toBe(false)
  })

  it('returns false for an empty string', () => {
    expect(isBeforeNow('')).toBe(false)
  })
})
