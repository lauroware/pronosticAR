import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useNotificaciones from '../hooks/useNotificaciones';
import api from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const MiPerfil = () => {
  const { usuario, setUsuario } = useAuth();
  const { success, error } = useNotificaciones();
  const [form, setForm]   = useState({ nombre: usuario?.nombre || '', apellido: usuario?.apellido || '' });
  const [pwForm, setPwForm] = useState({ passwordActual: '', passwordNueva: '', confirmar: '' });
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);

  const handlePerfil = async (e) => {
    e.preventDefault();
    setLoadingPerfil(true);
    try {
      const { data } = await api.put('/usuarios/perfil', form);
      setUsuario(data.usuario);
      success('Perfil actualizado');
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al actualizar');
    } finally { setLoadingPerfil(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.passwordNueva !== pwForm.confirmar) {
      return error('Las contraseñas no coinciden');
    }
    setLoadingPw(true);
    try {
      await api.put('/usuarios/cambiar-password', {
        passwordActual: pwForm.passwordActual,
        passwordNueva:  pwForm.passwordNueva,
      });
      success('Contraseña actualizada');
      setPwForm({ passwordActual: '', passwordNueva: '', confirmar: '' });
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al cambiar contraseña');
    } finally { setLoadingPw(false); }
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">👤 Mi Perfil</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Puntos',      value: usuario?.stats?.puntajeTotal ?? 0 },
          { label: 'Exactos',     value: usuario?.stats?.aciertosExactos ?? 0 },
          { label: 'Ganadores',   value: usuario?.stats?.aciertosGanador ?? 0 },
          { label: 'Efectividad', value: `${usuario?.efectividad ?? 0}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-blue-700">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Editar datos */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Datos personales</h2>
        <form onSubmit={handlePerfil} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            <Input label="Apellido" value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <p className="text-sm text-gray-500 mt-1 bg-gray-50 rounded-lg px-3 py-2">@{usuario?.username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-sm text-gray-500 mt-1 bg-gray-50 rounded-lg px-3 py-2">{usuario?.email}</p>
          </div>
          <Button type="submit" loading={loadingPerfil} className="self-end">Guardar cambios</Button>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Cambiar contraseña</h2>
        <form onSubmit={handlePassword} className="flex flex-col gap-4">
          <Input label="Contraseña actual" type="password" value={pwForm.passwordActual}
            onChange={(e) => setPwForm({ ...pwForm, passwordActual: e.target.value })} required />
          <Input label="Nueva contraseña" type="password" value={pwForm.passwordNueva}
            onChange={(e) => setPwForm({ ...pwForm, passwordNueva: e.target.value })} required />
          <Input label="Confirmar nueva contraseña" type="password" value={pwForm.confirmar}
            onChange={(e) => setPwForm({ ...pwForm, confirmar: e.target.value })} required />
          <Button type="submit" loading={loadingPw} className="self-end">Cambiar contraseña</Button>
        </form>
      </div>
    </div>
  );
};

export default MiPerfil;