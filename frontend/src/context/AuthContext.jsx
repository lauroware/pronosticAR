import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      verificarUsuario();
    } else {
      setCargando(false);
    }
  }, [token]);

  const verificarUsuario = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUsuario(data.usuario);
    } catch (error) {
      logout();
    } finally {
      setCargando(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUsuario(data.usuario);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/registro', userData);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUsuario(data.usuario);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);