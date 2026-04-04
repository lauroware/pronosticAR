import { useState } from 'react';
import DashboardAdmin from '../components/admin/DashboardAdmin';
import GestionUsuarios from '../components/admin/GestionUsuarios';
import { useEffect } from 'react';
import useNotificaciones from '../hooks/useNotificaciones';
import usePartidos from '../hooks/usePartidos';
import { cargarResultado } from '../services/partidoService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const ResultadoModal = ({ partido, onGuardado, onCerrar }) => {
  const [form, setForm] = useState({ golesLocal: '', golesVisitante: '' });
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotificaciones();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await cargarResultado(partido._id, {
        golesLocal: Number(form.golesLocal), golesVisitante: Number(form.golesVisitante),
      });
      success(`Resultado ${form.golesLocal}-${form.golesVisitante} · ${data.procesados} pronósticos evaluados`);
      onGuardado(data.data);
    } catch (err) { error(err.response?.data?.mensaje || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <Modal abierto={!!partido} onCerrar={onCerrar} titulo="Cargar resultado">
      <p className="text-sm text-gray-600 mb-4 font-medium">
        {partido?.equipoLocal.nombre} vs {partido?.equipoVisitante.nombre}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <Input label={partido?.equipoLocal.nombre} type="number" min="0" max="30"
            value={form.golesLocal} onChange={(e) => setForm({ ...form, golesLocal: e.target.value })} required />
          <span className="mb-2 text-2xl text-gray-400 font-bold">-</span>
          <Input label={partido?.equipoVisitante.nombre} type="number" min="0" max="30"
            value={form.golesVisitante} onChange={(e) => setForm({ ...form, golesVisitante: e.target.value })} required />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" loading={loading}>Guardar resultado</Button>
        </div>
      </form>
    </Modal>
  );
};

const GestionPartidosTab = () => {
  const { partidos, cargando, setPartidos } = usePartidos({ estado: 'programado', limit: 100 });
  const [seleccionado, setSeleccionado] = useState(null);

  const handleGuardado = (actualizado) => {
    setPartidos((prev) => prev.filter((p) => p._id !== actualizado._id));
    setSeleccionado(null);
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-5 py-4 border-b bg-gray-50 font-semibold text-gray-800">Cargar resultados</div>
      {cargando ? <div className="p-8 text-center text-gray-400">Cargando...</div> :
       partidos.length === 0 ? <div className="p-8 text-center text-gray-400">No hay partidos pendientes</div> : (
        <div className="divide-y">
          {partidos.map((p) => (
            <div key={p._id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium">{p.equipoLocal.nombre} vs {p.equipoVisitante.nombre}</p>
                <p className="text-xs text-gray-400">
                  {new Date(p.fechaHora).toLocaleDateString('es-AR')} · Grupo {p.grupoFase} · {p.totalPronosticos} pronósticos
                </p>
              </div>
              <Button size="sm" onClick={() => setSeleccionado(p)}>Cargar resultado</Button>
            </div>
          ))}
        </div>
      )}
      {seleccionado && <ResultadoModal partido={seleccionado} onGuardado={handleGuardado} onCerrar={() => setSeleccionado(null)} />}
    </div>
  );
};

const TABS = [
  { id: 'stats',    label: '📊 Stats' },
  { id: 'partidos', label: '⚽ Partidos' },
  { id: 'usuarios', label: '👤 Usuarios' },
];

const AdminPanel = () => {
  const [tab, setTab] = useState('stats');
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-gray-900">⚙️ Panel Admin</h1>
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'stats'    && <DashboardAdmin />}
      {tab === 'partidos' && <GestionPartidosTab />}
      {tab === 'usuarios' && <GestionUsuarios />}
    </div>
  );
};
export default AdminPanel;