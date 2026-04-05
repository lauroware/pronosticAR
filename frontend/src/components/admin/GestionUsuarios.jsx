import { useEffect, useState } from 'react';
import api from '../../services/api';
import useNotificaciones from '../../hooks/useNotificaciones';
import Loading from '../common/Loading';
import Button from '../common/Button';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios]   = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [buscar, setBuscar]       = useState('');
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const { success, error }        = useNotificaciones();

  const cargar = (q = '') => {
    setCargando(true);
    api.get(`/admin/usuarios${q ? `?buscar=${q}` : ''}`)
      .then(({ data }) => setUsuarios(data.data))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const handleBuscar = (e) => {
    const q = e.target.value;
    setBuscar(q);
    clearTimeout(window._buscarTimer);
    window._buscarTimer = setTimeout(() => cargar(q), 400);
  };

  const toggleActivo = async (id) => {
    try {
      const { data } = await api.put(`/admin/usuarios/${id}/toggle`);
      setUsuarios((prev) => prev.map((u) => u.id === id ? data.data : u));
      success('Usuario actualizado');
    } catch { error('Error al actualizar'); }
  };

  const eliminar = async (id) => {
    try {
      await api.delete(`/admin/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      setConfirmEliminar(null);
      success('Usuario eliminado');
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
          placeholder="Buscar por usuario, email o nombre..."
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {buscar && (
          <button onClick={() => { setBuscar(''); cargar(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            ✕
          </button>
        )}
      </div>

      {/* Listado */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">Usuarios ({usuarios.length})</h3>
        </div>

        {cargando ? <Loading /> : usuarios.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-sm">Sin resultados</p>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {usuarios.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/20 transition-colors">

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {u.avatar
                    ? <img src={u.avatar} alt={u.nombre} className="w-full h-full object-cover"/>
                    : <span className="text-white text-xs font-bold">
                        {u.nombre?.[0]}{u.apellido?.[0]}
                      </span>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {u.nombre} {u.apellido}
                    {u.rol === 'admin' && (
                      <span className="ml-1.5 text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-full">
                        admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 truncate">@{u.username} · {u.email}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {u.stats?.puntajeTotal || 0} pts · {u.stats?.totalPronosticos || 0} pronósticos
                  </p>
                </div>

                {/* Estado */}
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 hidden sm:block ${
                  u.activo ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                           : 'bg-red-500/15 text-red-400 border border-red-500/30'
                }`}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>

                {/* Acciones */}
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => toggleActivo(u.id)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                      u.activo
                        ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'
                        : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </button>

                  {u.rol !== 'admin' && (
                    <button
                      onClick={() => setConfirmEliminar(u)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal confirmación eliminar */}
      {confirmEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmEliminar(null)}/>
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full z-10 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">¿Eliminar usuario?</h3>
            <p className="text-gray-400 text-sm mb-1">
              Vas a eliminar a <span className="text-white font-medium">@{confirmEliminar.username}</span>.
            </p>
            <p className="text-red-400 text-xs mb-6">
              ⚠️ Esta acción borra también todos sus pronósticos y no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmEliminar(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminar(confirmEliminar.id)}
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

export default GestionUsuarios;