import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Orden pensado para UX: primero lo que el usuario hace siempre
  const menuItems = [
    { path: '/dashboard',   emoji: '🏠', label: 'Inicio'      },
    { path: '/partidos',    emoji: '⚽', label: 'Pronosticar' },
    { path: '/grupos',      emoji: '👥', label: 'Mis Grupos'  },
    { path: '/rankings',    emoji: '🏆', label: 'Ranking'     },
    { path: '/fixture',     emoji: '📅', label: 'Fixture'     },
    { path: '/novedades',   emoji: '📰', label: 'Novedades'   },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <span className="text-white text-sm lg:text-base font-bold">P</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline">
              PronosticAR
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center gap-1 flex-1 mx-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User section */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/perfil"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-full border border-gray-700 hover:border-gray-500 transition-colors"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {usuario?.nombre?.charAt(0)}{usuario?.apellido?.charAt(0)}
                </span>
              </div>
              <span className="text-sm text-gray-300 hidden lg:inline">@{usuario?.username}</span>
            </Link>

            {usuario?.rol === 'admin' && (
              <Link to="/admin" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:inline px-2">
                ⚙️
              </Link>
            )}

            <Button
              variant="ghost"
              size="md"
              onClick={handleLogout}
              className="!rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 text-sm"
            >
              🚪 Salir
            </Button>

            {/* Hamburguesa mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Menú"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                {item.label}
              </Link>
            ))}

            <Link
              to="/perfil"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-400 hover:bg-gray-800/50 hover:text-white"
            >
              <span className="text-xl">👤</span>
              Mi Perfil
            </Link>

            {usuario?.rol === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-400 hover:bg-gray-800/50 hover:text-white"
              >
                <span className="text-xl">⚙️</span>
                Admin
              </Link>
            )}

            <button
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <span className="text-xl">🚪</span>
              Salir
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
