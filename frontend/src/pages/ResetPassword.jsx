import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import useNotificaciones from '../hooks/useNotificaciones';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState(true);
  const { success, error } = useNotificaciones();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      error('Enlace inválido');
      setTokenValido(false);
    }
  }, [token, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      error('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      success('Contraseña actualizada. Ya puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-red-600">Enlace inválido o expirado.</p>
          <button onClick={() => navigate('/forgot-password')} className="text-blue-600 hover:underline mt-4">
            Solicitar nuevo enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">Nueva contraseña</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Ingresá tu nueva contraseña</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input label="Nueva contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label="Confirmar contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <Button type="submit" loading={loading} className="w-full">Actualizar contraseña</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; //probando ultima prueba