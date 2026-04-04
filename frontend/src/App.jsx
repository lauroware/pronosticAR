import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GrupoProvider } from './context/GrupoContext';
import { NotificationProvider, NotificationContext } from './context/NotificationContext';
import AppRoutes from './routes';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import useAuth from './hooks/useAuth';
import { useContext } from 'react';

// Toast global de notificaciones
const ToastContainer = () => {
  const { notificaciones } = useContext(NotificationContext);
  const colores = {
    success: 'bg-green-600',
    error:   'bg-red-600',
    info:    'bg-blue-600',
    warning: 'bg-yellow-500',
  };
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {notificaciones.map((n) => (
        <div key={n.id} className={`${colores[n.tipo]} text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-xs animate-fade-in`}>
          {n.mensaje}
        </div>
      ))}
    </div>
  );
};

const AppLayout = () => {
  const { usuario, cargando } = useAuth();
  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!usuario) return <AppRoutes />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <main className="animate-fade-up">
          <AppRoutes />
        </main>
      </div>
      <Footer />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <NotificationProvider>
      <AuthProvider>
        <GrupoProvider>
          <AppLayout />
          <ToastContainer />
        </GrupoProvider>
      </AuthProvider>
    </NotificationProvider>
  </BrowserRouter>
);

export default App;