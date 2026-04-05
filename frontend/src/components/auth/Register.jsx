import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';
import { esEmailValido, esPasswordValida, esUsernameValido } from '../../validators';
import { getBandera } from '../../utils/banderas';

// Todos los equipos del Mundial 2026
const EQUIPOS = [
  { codigo: 'ARG', nombre: 'Argentina' },
  { codigo: 'AUS', nombre: 'Australia' },
  { codigo: 'AUT', nombre: 'Austria' },
  { codigo: 'BEL', nombre: 'Bélgica' },
  { codigo: 'BIH', nombre: 'Bosnia y Herzegovina' },
  { codigo: 'BRA', nombre: 'Brasil' },
  { codigo: 'CAN', nombre: 'Canadá' },
  { codigo: 'COL', nombre: 'Colombia' },
  { codigo: 'CPV', nombre: 'Cabo Verde' },
  { codigo: 'CIV', nombre: 'Costa de Marfil' },
  { codigo: 'CRO', nombre: 'Croacia' },
  { codigo: 'CUW', nombre: 'Curazao' },
  { codigo: 'CZE', nombre: 'Rep. Checa' },
  { codigo: 'ECU', nombre: 'Ecuador' },
  { codigo: 'EGY', nombre: 'Egipto' },
  { codigo: 'ENG', nombre: 'Inglaterra' },
  { codigo: 'ESP', nombre: 'España' },
  { codigo: 'FRA', nombre: 'Francia' },
  { codigo: 'GER', nombre: 'Alemania' },
  { codigo: 'GHA', nombre: 'Ghana' },
  { codigo: 'HAI', nombre: 'Haití' },
  { codigo: 'IRN', nombre: 'Irán' },
  { codigo: 'JOR', nombre: 'Jordania' },
  { codigo: 'JPN', nombre: 'Japón' },
  { codigo: 'KOR', nombre: 'Corea del Sur' },
  { codigo: 'KSA', nombre: 'Arabia Saudita' },
  { codigo: 'MAR', nombre: 'Marruecos' },
  { codigo: 'MEX', nombre: 'México' },
  { codigo: 'NED', nombre: 'Países Bajos' },
  { codigo: 'NOR', nombre: 'Noruega' },
  { codigo: 'NZL', nombre: 'Nueva Zelanda' },
  { codigo: 'PAN', nombre: 'Panamá' },
  { codigo: 'PAR', nombre: 'Paraguay' },
  { codigo: 'POR', nombre: 'Portugal' },
  { codigo: 'QAT', nombre: 'Qatar' },
  { codigo: 'RSA', nombre: 'Sudáfrica' },
  { codigo: 'SCO', nombre: 'Escocia' },
  { codigo: 'SEN', nombre: 'Senegal' },
  { codigo: 'SUI', nombre: 'Suiza' },
  { codigo: 'SWE', nombre: 'Suecia' },
  { codigo: 'TUN', nombre: 'Túnez' },
  { codigo: 'TUR', nombre: 'Turquía' },
  { codigo: 'URU', nombre: 'Uruguay' },
  { codigo: 'USA', nombre: 'Estados Unidos' },
  { codigo: 'UZB', nombre: 'Uzbekistán' },
].sort((a, b) => a.nombre.localeCompare(b.nombre));

const PUESTOS = [
  { key: 'campeon', label: '🥇 Campeón',    color: 'border-yellow-500/40 bg-yellow-500/10' },
  { key: 'segundo', label: '🥈 2do puesto', color: 'border-gray-400/40 bg-gray-500/10' },
  { key: 'tercero', label: '🥉 3er puesto', color: 'border-orange-600/40 bg-orange-600/10' },
  { key: 'cuarto',  label: '4️⃣  4to puesto', color: 'border-blue-500/40 bg-blue-500/10' },
];

// Selector con bandera
const SelectorEquipo = ({ label, color, value, onChange, excluir }) => {
  const [busqueda, setBusqueda] = useState('');
  const [abierto, setAbierto]   = useState(false);

  const opciones = EQUIPOS.filter(
    (e) =>
      !excluir.includes(e.codigo) &&
      e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const seleccionado = EQUIPOS.find((e) => e.codigo === value);

  return (
    <div className={`relative border rounded-xl p-3 ${color}`}>
      <p className="text-xs font-semibold text-gray-400 mb-2">{label}</p>

      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-2 text-sm text-left hover:bg-gray-700/60 transition-colors"
      >
        {seleccionado ? (
          <>
            <span className="text-xl leading-none">{getBandera(seleccionado.codigo)}</span>
            <span className="text-white font-medium flex-1">{seleccionado.nombre}</span>
          </>
        ) : (
          <span className="text-gray-500 flex-1">Elegí un equipo...</span>
        )}
        <span className="text-gray-500 text-xs">{abierto ? '▲' : '▼'}</span>
      </button>

      {abierto && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Buscador */}
          <div className="p-2 border-b border-gray-800">
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg outline-none placeholder-gray-500"
              autoFocus
            />
          </div>
          {/* Lista */}
          <div className="max-h-48 overflow-y-auto">
            {opciones.length === 0 ? (
              <p className="text-center text-gray-500 text-xs py-4">Sin resultados</p>
            ) : (
              opciones.map((e) => (
                <button
                  key={e.codigo}
                  type="button"
                  onClick={() => { onChange(e.codigo); setAbierto(false); setBusqueda(''); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-800 transition-colors"
                >
                  <span className="text-xl leading-none">{getBandera(e.codigo)}</span>
                  <span className="text-gray-200">{e.nombre}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Register = () => {
  const [form, setForm]   = useState({ nombre: '', apellido: '', username: '', email: '', password: '' });
  const [final, setFinal] = useState({ campeon: '', segundo: '', tercero: '', cuarto: '' });
  const [paso, setPaso]   = useState(1); // 1 = datos, 2 = pronóstico
  const [loading, setLoading] = useState(false);
  const { register }      = useAuth();
  const { error }         = useNotificaciones();
  const navigate          = useNavigate();

  const handlePaso1 = (e) => {
    e.preventDefault();
    if (!esEmailValido(form.email))       return error('Email inválido');
    if (!esPasswordValida(form.password)) return error('La contraseña debe tener al menos 6 caracteres');
    if (!esUsernameValido(form.username)) return error('Username: 3-30 caracteres, solo letras, números y guiones');
    setPaso(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const completo = final.campeon && final.segundo && final.tercero && final.cuarto;
    if (!completo) return error('Elegí los 4 puestos para continuar');

    const seleccionados = [final.campeon, final.segundo, final.tercero, final.cuarto];
    if (new Set(seleccionados).size !== 4) return error('No podés elegir el mismo equipo para dos puestos');

    setLoading(true);
    try {
      await register({ ...form, pronosticoFinal: final });
      navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const elegidos = Object.values(final).filter(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
          <p className="text-gray-400 text-sm mt-1">Unite a PronosticAR</p>
          {/* Indicador de paso */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-8 h-1.5 rounded-full transition-colors ${paso >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}/>
            <div className={`w-8 h-1.5 rounded-full transition-colors ${paso >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}/>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">

          {/* ── PASO 1: Datos personales ── */}
          {paso === 1 && (
            <form onSubmit={handlePaso1} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Nombre" value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Juan" dark required />
                <Input label="Apellido" value={form.apellido}
                  onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                  placeholder="Pérez" dark required />
              </div>
              <Input label="Username" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
                placeholder="juanperez" dark required />
              <Input label="Email" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="juan@email.com" dark required />
              <Input label="Contraseña" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" dark required />
              <Button type="submit" className="w-full">
                Siguiente →
              </Button>
              <p className="text-center text-sm text-gray-400">
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" className="text-blue-400 font-medium hover:text-blue-300">
                  Iniciá sesión
                </Link>
              </p>
            </form>
          )}

          {/* ── PASO 2: Pronóstico final ── */}
          {paso === 2 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="text-center mb-1">
                <p className="text-white font-semibold">¿Quién va a ganar el Mundial?</p>
                <p className="text-gray-400 text-xs mt-1">
                  Elegí los 4 primeros puestos · <span className="text-yellow-400">+7 pts por cada acierto</span>
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  ⚠️ No se puede cambiar después de registrarse
                </p>
              </div>

              {PUESTOS.map(({ key, label, color }) => (
                <SelectorEquipo
                  key={key}
                  label={label}
                  color={color}
                  value={final[key]}
                  onChange={(v) => setFinal({ ...final, [key]: v })}
                  excluir={Object.entries(final)
                    .filter(([k, v]) => k !== key && v)
                    .map(([, v]) => v)}
                />
              ))}

              <div className="flex gap-2 mt-2">
                <Button type="button" variant="ghost" onClick={() => setPaso(1)} className="flex-1">
                  ← Atrás
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={elegidos.length < 4}
                  className="flex-1"
                >
                  Registrarse
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;