import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate            = useNavigate();
  const location            = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', emoji: '🏠', label: 'Inicio'      },
    { path: '/partidos',  emoji: '⚽', label: 'Pronosticar' },
    { path: '/grupos',    emoji: '👥', label: 'Mis Grupos'  },
    { path: '/rankings',  emoji: '🏆', label: 'Ranking'     },
    { path: '/fixture',   emoji: '📅', label: 'Fixture'     },
    { path: '/novedades', emoji: '📰', label: 'Novedades'   },
  ];

  // Iniciales como fallback si no hay avatar
  const iniciales = `${usuario?.nombre?.charAt(0) || ''}${usuario?.apellido?.charAt(0) || ''}`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center shrink-0 group hover:opacity-80 transition-opacity">
            <svg viewBox="0 0 200 48" width="140" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="nb" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60a5fa"/>
                  <stop offset="100%" stopColor="#a78bfa"/>
                </linearGradient>
                <linearGradient id="nt" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#93c5fd"/>
                  <stop offset="100%" stopColor="#c4b5fd"/>
                </linearGradient>
              </defs>
              <circle cx="22" cy="24" r="16" fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.25"/>
              <circle cx="22" cy="24" r="10" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.45"/>
              <circle cx="22" cy="24" r="5.5" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.65"/>
              <circle cx="22" cy="24" r="2.5" fill="url(#nb)"/>
              <line x1="22" y1="6"  x2="22" y2="14" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
              <line x1="22" y1="34" x2="22" y2="42" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
              <line x1="4"  y1="24" x2="12" y2="24" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
              <line x1="32" y1="24" x2="40" y2="24" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
              <circle cx="22" cy="24" r="1.5" fill="#ffffff" opacity="0.9"/>
              <line x1="48" y1="10" x2="48" y2="38" stroke="#1e3a5f" strokeWidth="0.8"/>
              <text x="56" y="21" fontFamily="system-ui,-apple-system,sans-serif" fontSize="12" fontWeight="700" fill="#ffffff" letterSpacing="-0.3">Pronostic</text>
              <text x="56" y="37" fontFamily="system-ui,-apple-system,sans-serif" fontSize="16" fontWeight="900" fill="url(#nt)" letterSpacing="-0.5">AR</text>
              <line x1="56" y1="41" x2="79" y2="41" stroke="url(#nb)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
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
            {/* Avatar — muestra foto si existe, iniciales si no */}
            <Link
              to="/perfil"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-full border border-gray-700 hover:border-gray-500 transition-colors"
            >
              {usuario?.avatar ? (
                <img
                  src={usuario.avatar}
                  alt={usuario.nombre}
                  className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover border border-gray-600"
                />
              ) : (
                <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{iniciales}</span>
                </div>
              )}
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

            {/* Avatar mobile en el menú */}
            <Link
              to="/perfil"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 bg-gray-800/40"
            >
              {usuario?.avatar ? (
                <img
                  src={usuario.avatar}
                  alt={usuario.nombre}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{iniciales}</span>
                </div>
              )}
              <div>
                <p className="text-white text-sm font-medium">{usuario?.nombre} {usuario?.apellido}</p>
                <p className="text-gray-400 text-xs">@{usuario?.username}</p>
              </div>
            </Link>

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