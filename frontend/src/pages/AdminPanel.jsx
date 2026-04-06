import { useState, useEffect } from 'react';
import DashboardAdmin from '../components/admin/DashboardAdmin';
import GestionUsuarios from '../components/admin/GestionUsuarios';
import GestionGrupos from '../components/admin/GestionGrupos';
import useNotificaciones from '../hooks/useNotificaciones';
import { cargarResultado } from '../services/partidoService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import api from '../services/api';
import { getBandera } from '../utils/banderas';

// ── Modal para cargar resultado ───────────────────────────────────────────────
const ResultadoModal = ({ partido, onGuardado, onCerrar }) => {
  const [form, setForm]   = useState({ golesLocal: '', golesVisitante: '' });
  const [loading, setLoading] = useState(false);
  const { success, error }    = useNotificaciones();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await cargarResultado(partido._id, {
        golesLocal:      Number(form.golesLocal),
        golesVisitante:  Number(form.golesVisitante),
      });
      success(`✅ ${form.golesLocal}-${form.golesVisitante} · ${data.procesados} pronósticos evaluados`);
      onGuardado(data.data);
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al cargar resultado');
    } finally {
      setLoading(false);
    }
  };

  if (!partido) return null;

  return (
    <Modal abierto={!!partido} onCerrar={onCerrar} titulo="Cargar resultado" size="sm">
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="text-center">
          <span className="text-3xl">{getBandera(partido.equipoLocal.codigoPais)}</span>
          <p className="text-xs text-gray-400 mt-1 max-w-[80px] leading-tight">{partido.equipoLocal.nombre}</p>
        </div>
        <span className="text-gray-600 font-bold">vs</span>
        <div className="text-center">
          <span className="text-3xl">{getBandera(partido.equipoVisitante.codigoPais)}</span>
          <p className="text-xs text-gray-400 mt-1 max-w-[80px] leading-tight">{partido.equipoVisitante.nombre}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-3 justify-center">
          <Input
            label={partido.equipoLocal.nombre}
            type="number" min="0" max="30"
            value={form.golesLocal}
            onChange={(e) => setForm({ ...form, golesLocal: e.target.value })}
            className="w-24 text-center" dark required
          />
          <span className="text-2xl font-bold text-gray-500 mt-4">—</span>
          <Input
            label={partido.equipoVisitante.nombre}
            type="number" min="0" max="30"
            value={form.golesVisitante}
            onChange={(e) => setForm({ ...form, golesVisitante: e.target.value })}
            className="w-24 text-center" dark required
          />
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="ghost" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" loading={loading}>Guardar resultado</Button>
        </div>
      </form>
    </Modal>
  );
};

// ── Tab de partidos ───────────────────────────────────────────────────────────
const ESTADOS_FILTRO = [
  { valor: 'programado', label: 'Pendientes' },
  { valor: 'finalizado', label: 'Finalizados' },
  { valor: '',           label: 'Todos' },
];

const GestionPartidosTab = () => {
  const [partidos, setPartidos]       = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState('programado');
  const [seleccionado, setSeleccionado] = useState(null);

  const cargar = (estado = 'programado') => {
    setCargando(true);
    api.get(`/admin/partidos${estado ? `?estado=${estado}` : ''}`)
      .then(({ data }) => setPartidos(data.data))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(estadoFiltro); }, [estadoFiltro]);

  const handleGuardado = (actualizado) => {
    setPartidos((prev) =>
      estadoFiltro === 'programado'
        ? prev.filter((p) => p._id !== actualizado._id)
        : prev.map((p) => p._id === actualizado._id ? actualizado : p)
    );
    setSeleccionado(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <div className="flex gap-2">
        {ESTADOS_FILTRO.map(({ valor, label }) => (
          <button
            key={label}
            onClick={() => setEstadoFiltro(valor)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              estadoFiltro === valor
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white border border-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-700">
          <h3 className="font-semibold text-white text-sm">
            {partidos.length} partido{partidos.length !== 1 ? 's' : ''}
          </h3>
        </div>

        {cargando ? <Loading /> : partidos.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-sm">Sin partidos</p>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {partidos.map((p) => (
              <div key={p._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/20">
                {/* Equipos con banderas */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <span className="text-lg">{getBandera(p.equipoLocal.codigoPais)}</span>
                    <span className="truncate">{p.equipoLocal.nombre}</span>
                    <span className="text-gray-500 shrink-0">vs</span>
                    <span className="truncate">{p.equipoVisitante.nombre}</span>
                    <span className="text-lg">{getBandera(p.equipoVisitante.codigoPais)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(p.fechaHora).toLocaleDateString('es-AR', {
                      weekday: 'short', day: '2-digit', month: '2-digit',
                    })} {new Date(p.fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    {p.fase && ` · ${p.fase}`}
                    {p.grupoFase && ` ${p.grupoFase}`}
                    {` · ${p.totalPronosticos || 0} pronósticos`}
                  </p>
                </div>

                {/* Resultado si finalizó */}
                {p.estado === 'finalizado' && (
                  <span className="text-lg font-bold text-white shrink-0">
                    {p.resultado?.golesLocal} — {p.resultado?.golesVisitante}
                  </span>
                )}

                {/* Badge estado */}
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 hidden sm:block ${
                  p.estado === 'programado' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : p.estado === 'finalizado' ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                  : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                }`}>
                  {p.estado}
                </span>

                {/* Botón — solo si no finalizó */}
                {p.estado !== 'finalizado' && (
                  <button
                    onClick={() => setSeleccionado(p)}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-colors"
                  >
                    Cargar resultado
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ResultadoModal
        partido={seleccionado}
        onGuardado={handleGuardado}
        onCerrar={() => setSeleccionado(null)}
      />
    </div>
  );
};

// ── Panel principal ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'stats',    label: '📊 Stats'    },
  { id: 'partidos', label: '⚽ Partidos' },
  { id: 'usuarios', label: '👤 Usuarios' },
  { id: 'grupos',   label: '👥 Grupos'   },
];

const AdminPanel = () => {
  const [tab, setTab] = useState('partidos');

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-white">⚙️ Panel Admin</h1>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white border border-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'stats'    && <DashboardAdmin />}
      {tab === 'partidos' && <GestionPartidosTab />}
      {tab === 'usuarios' && <GestionUsuarios />}
      {tab === 'grupos'   && <GestionGrupos />}
    </div>
  );
};

export default AdminPanel;