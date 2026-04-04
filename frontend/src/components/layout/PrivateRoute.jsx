import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loading from '../common/Loading';

const PrivateRoute = ({ children, soloAdmin = false }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) return <Loading />;
  if (!usuario) return <Navigate to="/login" replace />;
  if (soloAdmin && usuario.rol !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

export default PrivateRoute;