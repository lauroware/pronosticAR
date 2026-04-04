import { useEffect, useState } from 'react';
import api from '../../services/api';
import Loading from '../common/Loading';

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(({ data }) => setStats(data.data)).catch(() => {}); }, []);
  if (!stats) return <Loading />;
  const items = [
    { label: 'Usuarios', value: stats.usuarios, icon: '👤' },
    { label: 'Partidos', value: stats.partidos, icon: '⚽' },
    { label: 'Pronósticos', value: stats.pronosticos, icon: '📋' },
    { label: 'Pendientes', value: stats.pendientes, icon: '⏳' },
    { label: 'Finalizados', value: stats.finalizados, icon: '✅' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map(({ label, value, icon }) => (
        <div key={label} className="bg-white rounded-xl border p-4 text-center">
          <p className="text-3xl mb-1">{icon}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
};
export default DashboardAdmin;