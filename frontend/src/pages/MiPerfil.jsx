import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useNotificaciones from '../hooks/useNotificaciones';
import api from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import EvolucionGrafico from '../components/rankings/EvolucionGrafico';
import SubirImagen from '../components/common/SubirImagen';

const TORNEO_ID = import.meta.env.VITE_TORNEO_ID || '';

const MiPerfil = () => {
  const { usuario, setUsuario } = useAuth();
  const { success, error } = useNotificaciones();
  const [form, setForm] = useState({ nombre: usuario?.nombre || '', apellido: usuario?.apellido || '' });
  const [pwForm, setPwForm] = useState({ passwordActual: '', passwordNueva: '', confirmar: '' });
  const [loadingP, setLoadingP] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);
  const [avatar, setAvatar] = useState(usuario?.avatar || '');

  const actualizarAvatar = async (url) => {
    try {
      const { data } = await api.put('/usuarios/perfil', { avatar: url });
      setUsuario(data.usuario);
      setAvatar(url);
      success('Foto de perfil actualizada');
    } catch (err) {
      error('Error al actualizar foto');
    }
  };

  const handlePerfil = async (e) => {
    e.preventDefault(); 
    setLoadingP(true);
    try {
      const { data } = await api.put('/usuarios/perfil', form);
      setUsuario(data.usuario); 
      success('Perfil actualizado');
    } catch (err) { 
      error(err.response?.data?.mensaje || 'Error'); 
    } finally { 
      setLoadingP(false); 
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.passwordNueva !== pwForm.confirmar) return error('Las contraseñas no coinciden');
    setLoadingPw(true);
    try {
      await api.put('/usuarios/cambiar-password', { 
        passwordActual: pwForm.passwordActual, 
        passwordNueva: pwForm.passwordNueva 
      });
      success('Contraseña actualizada'); 
      setPwForm({ passwordActual: '', passwordNueva: '', confirmar: '' });
    } catch (err) { 
      error(err.response?.data?.mensaje || 'Error'); 
    } finally { 
      setLoadingPw(false); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">👤 Mi Perfil</h1>

      {/* Avatar y subida de foto */}
      <div className="flex flex-col items-center gap-3 mb-6">
        {avatar ? (
          <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-blue-500" />
        ) : (
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
        )}
        <SubirImagen
          label="Cambiar foto de perfil"
          cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}
          uploadPreset={import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}
          onUpload={actualizarAvatar}
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Puntos', value: usuario?.stats?.puntajeTotal ?? 0, icon: '🏆' },
          { label: 'Exactos', value: usuario?.stats?.aciertosExactos ?? 0, icon: '🎯' },
          { label: 'Ganadores', value: usuario?.stats?.aciertosGanador ?? 0, icon: '✅' },
          { label: 'Efectividad', value: `${usuario?.efectividad ?? 0}%`, icon: '📊' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-2xl font-bold text-blue-400">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Evolución gráfica */}
      {usuario && <EvolucionGrafico usuarioId={usuario.id} torneoId={TORNEO_ID} />}

      {/* Datos personales */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-6">
        <h2 className="font-semibold text-white mb-4">Datos personales</h2>
        <form onSubmit={handlePerfil} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="input-moderno" required />
            <Input label="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} className="input-moderno" required />
          </div>
          <div className="bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700">
            <p className="text-sm text-gray-400">@{usuario?.username} · {usuario?.email}</p>
          </div>
          <Button type="submit" loading={loadingP} className="self-end btn-primary">Guardar cambios</Button>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <h2 className="font-semibold text-white mb-4">Cambiar contraseña</h2>
        <form onSubmit={handlePassword} className="flex flex-col gap-4">
          <Input label="Contraseña actual" type="password" value={pwForm.passwordActual} onChange={(e) => setPwForm({ ...pwForm, passwordActual: e.target.value })} className="input-moderno" required />
          <Input label="Nueva contraseña" type="password" value={pwForm.passwordNueva} onChange={(e) => setPwForm({ ...pwForm, passwordNueva: e.target.value })} className="input-moderno" required />
          <Input label="Confirmar" type="password" value={pwForm.confirmar} onChange={(e) => setPwForm({ ...pwForm, confirmar: e.target.value })} className="input-moderno" required />
          <Button type="submit" loading={loadingPw} className="self-end btn-primary">Cambiar contraseña</Button>
        </form>
      </div>
    </div>
  );
};

export default MiPerfil;