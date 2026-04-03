import { useState } from 'react';
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
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await cargarResultado(partido._id, {
        golesLocal:     Number(form.golesLocal),
        golesVisitante: Number(form.golesVisitante),
      });
      success(`Resultado cargado: ${form.golesLocal}-${form.golesVisitante} · ${data.procesados} pronósticos evaluados`);
      onGuardado(data.data);
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al cargar resultado');
    } finally { setLoading(false); }
  };

  return (
    <Modal abierto={!!partido} onCerrar={onCerrar} titulo="Cargar resultado">
      <div className="mb-4 text-sm text-gray-600">
        <span className="font-medium">{partido?.equipoLocal.nombre}</span>
        {' vs '}
        <span className="font-medium">{partido?.equipoVisitante.nombre}</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Input label={partido?.equipoLocal.nombre} type="number" min="0" max="30"
            value={form.golesLocal} onChange={(e) => setForm({ ...form, golesLocal: e.target.value })} required />
          <span className="mt-6 text-2xl text-gray-400 font-bold">-</span>
          <Input label={partido?.equipoVisitante.nombre} type="number" min="0" max="30"
            value={form.golesVisitante} onChange={(e) => setForm({ ...form, golesVisitante: e.target.value })} required />
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="ghost" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" loading={loading}>Guardar resultado</Button>
        </div>
      </form>
    </Modal>
  );
};

const AdminPanel = () => {
  const { partidos, cargando, setPartidos } = usePartidos({ estado: 'programado', limit: 100 });
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

  const handleGuardado = (partidoActualizado) => {
    setPartidos((prev) => prev.filter((p) => p._id !== partidoActualizado._id));
    setPartidoSeleccionado(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-gray-900">⚙️ Panel Admin</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">Cargar resultados</h2>
          <p className="text-xs text-gray-500 mt-1">Partidos programados pendientes de resultado</p>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : partidos.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No hay partidos pendientes</div>
        ) : (
          <div className="divide-y">
            {partidos.map((p) => (
              <div key={p._id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {p.equipoLocal.nombre} vs {p.equipoVisitante.nombre}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(p.fechaHora).toLocaleDateString('es-AR')} · {p.fase} · {p.totalPronosticos} pronósticos
                  </p>
                </div>
                <Button size="sm" onClick={() => setPartidoSeleccionado(p)}>
                  Cargar resultado
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {partidoSeleccionado && (
        <ResultadoModal
          partido={partidoSeleccionado}
          onGuardado={handleGuardado}
          onCerrar={() => setPartidoSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;