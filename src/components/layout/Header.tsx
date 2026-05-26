import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const CUP_START = new Date('2026-06-11T19:00:00-05:00')

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now())
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const { days, hours, minutes, seconds } = useCountdown(CUP_START)

  function handleLogout() {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
    }`

  const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`

  return (
    <header className="bg-copa-blue shadow-md">
      {/* Countdown banner */}
      <div className="bg-yellow-400 text-copa-blue text-center text-xs sm:text-sm font-semibold py-1.5 px-4 leading-snug">
        ⏱️ Faltam{' '}
        {plural(days, 'dia', 'dias')},{' '}
        {plural(hours, 'hora', 'horas')},{' '}
        {plural(minutes, 'minuto', 'minutos')} e{' '}
        {plural(seconds, 'segundo', 'segundos')}{' '}
        para começar a Copa do Mundo de 2026!
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white font-bold text-base sm:text-lg"
          onClick={() => setMenuOpen(false)}
        >
          <img src="/fwc26.png" width="72" alt="Logo" className="sm:w-[85px]" />
          <span className="hidden min-[380px]:inline">Bolão da Copa</span>
          <span className="text-xs text-yellow-300 font-normal hidden min-[380px]:inline">2026</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>Meus Bolões</NavLink>
              <NavLink to="/pools/create" className={navLinkClass}>Criar Bolão</NavLink>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-blue-700">
                <span className="text-sm text-blue-200 max-w-[120px] truncate">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-300 hover:text-red-200 transition-colors"
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>Entrar</NavLink>
              <Link to="/register" className="btn-primary text-xs px-3 py-1.5">Cadastrar</Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="sm:hidden bg-copa-blue border-t border-blue-700 px-4 py-3 flex flex-col gap-1">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-700 text-yellow-300' : 'text-white hover:bg-blue-700'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                📊 Meus Bolões
              </NavLink>
              <NavLink
                to="/pools/create"
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-700 text-yellow-300' : 'text-white hover:bg-blue-700'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                ➕ Criar Bolão
              </NavLink>
              <div className="border-t border-blue-700 mt-2 pt-2 flex items-center justify-between px-3">
                <span className="text-sm text-blue-200 truncate max-w-[180px]">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-300 hover:text-red-200 transition-colors font-medium"
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-3 py-2.5 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Entrar
              </NavLink>
              <Link
                to="/register"
                className="px-3 py-2.5 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
