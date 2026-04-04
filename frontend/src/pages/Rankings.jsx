import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useRankings from '../hooks/useRankings';
import { getRankingEntreGrupos } from '../services/rankingService';
import { useEffect } from 'react';
import RankingGlobal from '../components/rankings/RankingGlobal';
import RankingGrupos from '../components/rankings/RankingGrupos';
import EvolucionGrafico from '../components/rankings/EvolucionGrafico';
import Loading from '../components/common/Loading';

const TORNEO_ID = import.meta.env.VITE_TORNEO_ID || '';

const Rankings = () => {
  const { usuario } = useAuth();
  const [tab, setTab] = useState('global');
  const { rankings, cargando: cargandoGlobal } = useRankings(TORNEO_ID);
  const [rankingGrupos, setRankingGrupos] = useState([]);
  const [cargandoGrupos, setCargandoGrupos] = useState(false);

  useEffect(() => {
    if (tab === 'grupos' && TORNEO_ID) {
      setCargandoGrupos(true);
      getRankingEntreGrupos(TORNEO_ID)
        .then(({ data }) => {
          console.log('📊 Ranking grupos:', data.data);
          setRankingGrupos(data.data || []);
        })
        .catch((err) => {
          console.error('Error ranking grupos:', err);
          setRankingGrupos([]);
        })
        .finally(() => setCargandoGrupos(false));
    }
  }, [tab]);

  const tabs = [
    { id: 'global', label: '🌍 Global' },
    { id: 'grupos', label: '👥 Entre grupos' },
    { id: 'evolucion', label: '📈 Mi evolución' },
  ];

  console.log('Rankings globales:', rankings.length, cargandoGlobal);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-gray-900">🏆 Rankings</h1>
      
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'global' && (
        <RankingGlobal rankings={rankings} cargando={cargandoGlobal} />
      )}
      
      {tab === 'grupos' && (
        <RankingGrupos rankings={rankingGrupos} cargando={cargandoGrupos} />
      )}
      
      {tab === 'evolucion' && usuario && (
        <EvolucionGrafico usuarioId={usuario.id} torneoId={TORNEO_ID} />
      )}
    </div>
  );
};

export default Rankings;