import useAuth from '../hooks/useAuth';
import usePartidos from '../hooks/usePartidos';
import { getRankingGlobal } from '../services/rankingService';
import { useEffect, useState } from 'react';
import Loading from '../components/common/Loading';
import PartidoCard from '../components/partidos/PartidoCard';
import { getMisPronosticos } from '../services/pronosticoService';

const TORNEO_ID = import.meta.env.VITE_TORNEO_ID || '';

const Dashboard = () => {
  const { usuario } = useAuth();
  const { partidos, cargando: cargandoPartidos } = usePartidos({ estado: 'programado', limit: 5 });
  const [pronosticos, setPronosticos] = useState([]);
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    getMisPronosticos(TORNEO_ID).then(({ data }) => setPronosticos(data.data)).catch(() => {});
    getRankingGlobal(TORNEO_ID, 1).then(({ data }) => {
      const miRanking = data.data.find(r => r.usuario?._id === usuario?.id);
      setRanking(miRanking);
    }).catch(() => {});
  }, [usuario?.id]);

  const pronosticoMap = pronosticos.reduce((acc, p) => {
    acc[p.partido?._id || p.partido] = p;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">¡Hola, {usuario?.nombre}! 👋</h1>
        <p className="text-blue-100 mt-1">Bienvenido a PronosticAR</p>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-2xl font-bold">{ranking?.puntaje || 0}</p>
            <p className="text-xs text-blue-100">Puntos totales</p>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-2xl font-bold">#{ranking?.posicion || '-'}</p>
            <p className="text-xs text-blue-100">Posición global</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">⚽ Próximos partidos</h2>
        {cargandoPartidos ? <Loading /> : (
          <div className="flex flex-col gap-3">
            {partidos.slice(0, 20).map((p) => (
              <PartidoCard key={p._id} partido={p} miPronostico={pronosticoMap[p._id]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;