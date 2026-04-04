import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { error } = useNotificaciones();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-white text-3xl font-bold">P</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PronosticAR
          </h1>
          <p className="text-gray-400 mt-2">Iniciá sesión para continuar</p>
        </div>
        
        {/* Formulario */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input 
              label="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@email.com"
              className="input-moderno"
              required 
            />
            
            <Input 
              label="Contraseña" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••"
              className="input-moderno"
              required 
            />
            
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            
            <Button type="submit" loading={loading} className="w-full btn-primary">
              Ingresar
            </Button>
            
            <p className="text-center text-sm text-gray-400">
              ¿No tenés cuenta?{' '}
              <Link to="/registro" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                Registrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;