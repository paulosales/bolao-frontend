import { describe, it, expect } from 'vitest'
import { flagUrl, scoreSummary, matchResult } from '../../utils/scoreUtils'

describe('flagUrl', () => {
  it('lowercases the country code and returns CDN URL', () => {
    expect(flagUrl('BR')).toBe('https://flagcdn.com/w80/br.png')
  })

  it('handles already-lowercase input', () => {
    expect(flagUrl('fr')).toBe('https://flagcdn.com/w80/fr.png')
  })

  it('handles mixed-case input', () => {
    expect(flagUrl('Pt')).toBe('https://flagcdn.com/w80/pt.png')
  })
})

describe('scoreSummary', () => {
  it('formats a valid score', () => {
    expect(scoreSummary(2, 1)).toBe('2 x 1')
  })

  it('formats a zero-zero score', () => {
    expect(scoreSummary(0, 0)).toBe('0 x 0')
  })

  it('returns placeholder when both scores are null', () => {
    expect(scoreSummary(null, null)).toBe('- x -')
  })

  it('returns placeholder when home score is null', () => {
    expect(scoreSummary(null, 1)).toBe('- x -')
  })

  it('returns placeholder when away score is null', () => {
    expect(scoreSummary(1, null)).toBe('- x -')
  })
})

describe('matchResult', () => {
  it('returns home when home score is higher', () => {
    expect(matchResult(3, 1)).toBe('home')
  })

  it('returns away when away score is higher', () => {
    expect(matchResult(0, 2)).toBe('away')
  })

  it('returns draw when scores are equal', () => {
    expect(matchResult(1, 1)).toBe('draw')
  })

  it('returns draw on zero-zero', () => {
    expect(matchResult(0, 0)).toBe('draw')
  })
})
