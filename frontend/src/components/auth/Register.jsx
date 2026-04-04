import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';import { esEmailValido, esPasswordValida, esUsernameValido } from "../../validators";

const Register = () => {
  const [form, setForm] = useState({ nombre: '', apellido: '', username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { error } = useNotificaciones();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!esEmailValido(form.email)) return error('Email inválido');
    if (!esPasswordValida(form.password)) return error('La contraseña debe tener al menos 6 caracteres');
    if (!esUsernameValido(form.username)) return error('Username: 3-30 caracteres, solo letras, números, guiones y puntos');
    
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Crear cuenta
          </h1>
          <p className="text-gray-500 text-sm">Unite a PronosticAR</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input 
                label="Nombre" 
                value={form.nombre} 
                onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
                placeholder="Juan"
                required 
              />
              <Input 
                label="Apellido" 
                value={form.apellido} 
                onChange={(e) => setForm({ ...form, apellido: e.target.value })} 
                placeholder="Pérez"
                required 
              />
            </div>
            
            <Input 
              label="Username" 
              value={form.username} 
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} 
              placeholder="juanperez"
              required 
            />
            
            <Input 
              label="Email" 
              type="email" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              placeholder="juan@email.com"
              required 
            />
            
            <Input 
              label="Contraseña" 
              type="password" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              placeholder="••••••"
              required 
            />
            
            <Button type="submit" loading={loading} className="w-full !rounded-xl">
              Registrarse
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              ¿Ya tenés cuenta?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Iniciá sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;