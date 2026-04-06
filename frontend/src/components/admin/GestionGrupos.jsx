import { useEffect, useState } from 'react';
import api from '../../services/api';
import useNotificaciones from '../../hooks/useNotificaciones';
import Loading from '../common/Loading';

const GestionGrupos = () => {
  const [grupos, setGrupos]       = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [buscar, setBuscar]       = useState('');
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const { success, error }        = useNotificaciones();

  const cargar = (q = '') => {
    setCargando(true);
    api.get(`/admin/grupos${q ? `?buscar=${q}` : ''}`)
      .then(({ data }) => setGrupos(data.data))
      .catch(() => error('Error al cargar grupos'))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const handleBuscar = (e) => {
    const q = e.target.value;
    setBuscar(q);
    clearTimeout(window._buscarGrupoTimer);
    window._buscarGrupoTimer = setTimeout(() => cargar(q), 400);
  };

  const eliminar = async (id) => {
    try {
      await api.delete(`/admin/grupos/${id}`);
      setGrupos((prev) => prev.filter((g) => g._id !== id));
      setConfirmEliminar(null);
      success('Grupo eliminado');
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al eliminar');
    }
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Buscador */}
      <div className="relative">
        <input
          type="text"
          value={buscar}
          onChange={handleBuscar}
          placeholder="Buscar grupo por nombre..."
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {buscar && (
          <button
            onClick={() => { setBuscar(''); cargar(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >✕</button>
        )}
      </div>

      {/* Listado */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-700">
          <h3 className="font-semibold text-white text-sm">Grupos ({grupos.length})</h3>
        </div>

        {cargando ? <Loading /> : grupos.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-sm">Sin grupos</p>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {grupos.map((g) => (
              <div key={g._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/20 transition-colors">

                {/* Avatar del grupo */}
                <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border border-gray-600">
                  {g.imagen
                    ? <img src={g.imagen} alt={g.nombre} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {g.nombre?.[0]?.toUpperCase()}
                      </div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white truncate">{g.nombre}</p>
                    {g.premium && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded-full">
                        ⭐ Premium
                      </span>
                    )}
                    {g.esPrivado && (
                      <span className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded-full">
                        🔒 Privado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    👥 {g.cantidadMiembros} miembros
                    {g.creador?.username && ` · Admin: @${g.creador.username}`}
                  </p>
                  <p className="text-xs text-gray-600 font-mono mt-0.5">
                    Código: {g.codigoInvitacion}
                  </p>
                </div>

                {/* Fecha */}
                <span className="text-xs text-gray-500 hidden sm:block shrink-0">
                  {new Date(g.createdAt).toLocaleDateString('es-AR')}
                </span>

                {/* Eliminar */}
                <button
                  onClick={() => setConfirmEliminar(g)}
                  className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal confirmación */}
      {confirmEliminar && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">¿Eliminar grupo?</h3>
            <p className="text-gray-400 text-sm mb-1">
              Vas a eliminar <span className="text-white font-medium">"{confirmEliminar.nombre}"</span>.
            </p>
            <p className="text-red-400 text-xs mb-6">
              ⚠️ Se eliminan también todos sus miembros y rankings. No se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmEliminar(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminar(confirmEliminar._id)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionGrupos;