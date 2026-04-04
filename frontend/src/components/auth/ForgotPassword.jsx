import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const { success, error } = useNotificaciones();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setEnviado(true);
      success('Si el email existe, recibirás un enlace');
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-xl font-semibold mb-2">Revisá tu email</h2>
          <p className="text-gray-500 text-sm mb-6">Te enviamos un enlace para restablecer tu contraseña</p>
          <Link to="/login" className="text-blue-600 hover:underline">Volver al login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">¿Olvidaste tu contraseña?</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Ingresá tu email y te enviaremos un enlace para restablecerla</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" loading={loading} className="w-full">Enviar enlace</Button>
          
          <p className="text-center text-sm">
            <Link to="/login" className="text-blue-600 hover:underline">Volver al login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;