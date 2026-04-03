import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/layout/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Partidos from './pages/Partidos';
import MisGrupos from './pages/MisGrupos';
import GrupoDetail from './pages/GrupoDetail';
import Rankings from './pages/Rankings';
import MiPerfil from './pages/MiPerfil';
import AdminPanel from './pages/AdminPanel';

const AppRoutes = () => (
  <Routes>
    <Route path="/login"           element={<Login />} />
    <Route path="/registro"        element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/partidos"        element={<PrivateRoute><Partidos /></PrivateRoute>} />
    <Route path="/grupos"          element={<PrivateRoute><MisGrupos /></PrivateRoute>} />
    <Route path="/grupos/:id"      element={<PrivateRoute><GrupoDetail /></PrivateRoute>} />
    <Route path="/rankings"        element={<PrivateRoute><Rankings /></PrivateRoute>} />
    <Route path="/perfil"          element={<PrivateRoute><MiPerfil /></PrivateRoute>} />
    <Route path="/admin"           element={<PrivateRoute soloAdmin><AdminPanel /></PrivateRoute>} />

    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;