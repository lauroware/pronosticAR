import { useEffect, useState } from 'react';
import api from '../../services/api';
import useNotificaciones from '../../hooks/useNotificaciones';
import Loading from '../common/Loading';
import Button from '../common/Button';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { success, error } = useNotificaciones();

  const cargar = () => {
    api.get('/admin/usuarios').then(({ data }) => setUsuarios(data.data)).finally(() => setCargando(false));
  };
  useEffect(cargar, []);

  const toggleActivo = async (id) => {
    try {
      const { data } = await api.put(`/admin/usuarios/${id}/toggle`);
      setUsuarios((prev) => prev.map((u) => u.id === id ? data.data : u));
      success('Usuario actualizado');
    } catch { error('Error'); }
  };

  if (cargando) return <Loading />;
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-5 py-4 border-b bg-gray-50 font-semibold text-gray-800">Gestión de usuarios</div>
      <div className="divide-y">
        {usuarios.map((u) => (
          <div key={u.id} className="flex items-center gap-3 px-5 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium">@{u.username} <span className="text-xs text-gray-400">{u.rol}</span></p>
              <p className="text-xs text-gray-400">{u.email}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${u.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {u.activo ? 'Activo' : 'Inactivo'}
            </span>
            <Button size="sm" variant="ghost" onClick={() => toggleActivo(u.id)}>
              {u.activo ? 'Desactivar' : 'Activar'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default GestionUsuarios;