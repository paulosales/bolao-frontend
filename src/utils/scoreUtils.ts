export function flagUrl(countryCode: string): string {
  return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`
}

export function scoreSummary(home: number | null, away: number | null): string {
  if (home === null || away === null) return '- x -'
  return `${home} x ${away}`
}

export function matchResult(home: number, away: number): 'home' | 'away' | 'draw' {
  if (home > away) return 'home'
  if (away > home) return 'away'
  return 'draw'
}
