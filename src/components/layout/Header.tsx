import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-copa-blue shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
          <span className="text-2xl">⚽</span>
          <span>Bolão da Copa</span>
          <span className="text-xs text-yellow-300 font-normal">2026</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
                  }`
                }
              >
                Meus Bolões
              </NavLink>
              <NavLink
                to="/pools/create"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
                  }`
                }
              >
                Criar Bolão
              </NavLink>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-blue-700">
                <span className="text-sm text-blue-200">{user?.name}</span>
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
              <NavLink
                to="/login"
                className="text-sm font-medium text-white hover:text-yellow-200 transition-colors"
              >
                Entrar
              </NavLink>
              <Link to="/register" className="btn-primary text-xs px-3 py-1.5">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
