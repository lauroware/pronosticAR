import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';

// Logo SVG animado — versión en verde/esmeralda
const LogoAnimado = () => (
  <svg
    viewBox="0 0 260 90"
    width="220"
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: 'visible' }}
  >
    <defs>
      <linearGradient id="lg-green" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10b981"/>
        <stop offset="100%" stopColor="#34d399"/>
      </linearGradient>
      <linearGradient id="lg-text" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6ee7b7"/>
        <stop offset="100%" stopColor="#a7f3d0"/>
      </linearGradient>

      <style>{`
        /* Mira: aparece al inicio centrada en el canvas */
        .target-group {
          animation: targetSlide 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
        }
        @keyframes targetSlide {
          0%   { transform: translateX(88px); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: translateX(0px); opacity: 1; }
        }

        /* Separador aparece después de que la mira llega */
        .divider {
          animation: fadeIn 0.4s ease 1.3s both;
        }

        /* Texto "Pronostic" */
        .text-pronostic {
          animation: slideText 0.5s cubic-bezier(0.2, 0.8, 0.3, 1) 1.4s both;
        }
        @keyframes slideText {
          0%   { opacity: 0; transform: translateX(-12px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        /* Texto "AR" con leve delay */
        .text-ar {
          animation: slideText 0.5s cubic-bezier(0.2, 0.8, 0.3, 1) 1.6s both;
        }

        /* Línea bajo AR */
        .underline-ar {
          animation: growLine 0.4s ease 2s both;
          transform-origin: left center;
        }
        @keyframes growLine {
          0%   { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Pulso sutil del punto central — loop infinito después de que todo cargó */
        .center-dot {
          animation: dotPulse 2.5s ease-in-out 2.4s infinite;
        }
        @keyframes dotPulse {
          0%, 100% { r: 3; opacity: 0.9; }
          50%       { r: 4.5; opacity: 0.6; }
        }
      `}</style>
    </defs>

    {/* ── MIRA (se anima primero, luego se corre a la izquierda) ── */}
    <g className="target-group">
      <circle cx="42" cy="45" r="32" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.2"/>
      <circle cx="42" cy="45" r="22" fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="42" cy="45" r="13" fill="none" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.65"/>
      <circle cx="42" cy="45" r="5"  fill="url(#lg-green)"/>

      {/* Líneas de mira */}
      <line x1="42" y1="10" x2="42" y2="28" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="42" y1="62" x2="42" y2="80" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="8"  y1="45" x2="25" y2="45" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="59" y1="45" x2="76" y2="45" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>

      {/* Punto central con pulso */}
      <circle className="center-dot" cx="42" cy="45" r="3" fill="#ffffff" opacity="0.9"/>
    </g>

    {/* ── SEPARADOR ── */}
    <line className="divider" x1="88" y1="22" x2="88" y2="68" stroke="#065f46" strokeWidth="1"/>

    {/* ── TEXTO ── */}
    <text
      className="text-pronostic"
      x="100" y="40"
      fontFamily="system-ui,-apple-system,sans-serif"
      fontSize="22"
      fontWeight="700"
      fill="#ffffff"
      letterSpacing="-0.5"
    >
      Pronostic
    </text>
    <text
      className="text-ar"
      x="100" y="64"
      fontFamily="system-ui,-apple-system,sans-serif"
      fontSize="28"
      fontWeight="900"
      fill="url(#lg-text)"
      letterSpacing="-1"
    >
      AR
    </text>

    {/* Línea bajo AR */}
    <line
      className="underline-ar"
      x1="100" y1="70" x2="135" y2="70"
      stroke="url(#lg-green)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const { error }               = useNotificaciones();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="max-w-md w-full">

        {/* Logo animado */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <LogoAnimado />
          <p className="text-green-400 text-sm font-medium">
            🏆 Campeonato de puntos para el mundial 2026. ¡Elegí tus favoritos!
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              dark
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              dark
              required
            />
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Button type="submit" loading={loading} className="w-full btn-primary">
              Ingresar
            </Button>
            <p className="text-center text-sm text-gray-400">
              ¿No tenés cuenta?{' '}
              <Link to="/registro" className="text-green-400 font-medium hover:text-green-300 transition-colors">
                Registrate
              </Link>
            </p>
          </form>
        </div>

        {/* Tarjeta empresa - también con acentos verdes */}
        <a
          href="https://www.latinnexo.com.ar/prode"
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center gap-4 p-4 rounded-2xl border border-green-500/25 bg-gradient-to-r from-green-900/30 to-emerald-900/30 hover:from-green-900/40 hover:to-emerald-900/40 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🏢</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">¿Tenés una empresa?</p>
            <p className="text-xs text-gray-400 mt-0.5">Personalizá esta app para tu equipo de trabajo</p>
          </div>
          <span className="text-green-400 text-sm group-hover:translate-x-1 transition-transform shrink-0">→</span>
        </a>
      </div>
    </div>
  );
};

export default Login;