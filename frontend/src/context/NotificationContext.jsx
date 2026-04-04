import { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  const agregarNotificacion = useCallback((mensaje, tipo = 'info', duracion = 5000) => {
    const id = Date.now();
    setNotificaciones(prev => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setNotificaciones(prev => prev.filter(n => n.id !== id));
    }, duracion);
  }, []);

  const success = (msg) => agregarNotificacion(msg, 'success');
  const error = (msg) => agregarNotificacion(msg, 'error');
  const info = (msg) => agregarNotificacion(msg, 'info');
  const warning = (msg) => agregarNotificacion(msg, 'warning');

  return (
    <NotificationContext.Provider value={{ notificaciones, agregarNotificacion, success, error, info, warning }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificaciones = () => useContext(NotificationContext);

// 👇 ESTO ES LO QUE FALTABA 👇
export { NotificationContext };