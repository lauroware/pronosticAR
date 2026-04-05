import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useRankings from '../hooks/useRankings';
import { getRankingEntreGrupos } from '../services/rankingService';
import RankingGlobal from '../components/rankings/RankingGlobal';
import RankingGrupos from '../components/rankings/RankingGrupos';
import EvolucionGrafico from '../components/rankings/EvolucionGrafico';
import StatsPronosticoFinal from '../components/rankings/StatsPronosticoFinal';
import Loading from '../components/common/Loading';

const TORNEO_ID = import.meta.env.VITE_TORNEO_ID || '';

const Rankings = () => {
  const { usuario }     = useAuth();
  const [tab, setTab]   = useState('global');
  const { rankings, cargando: cargandoGlobal } = useRankings(TORNEO_ID);
  const [rankingGrupos, setRankingGrupos]       = useState([]);
  const [cargandoGrupos, setCargandoGrupos]     = useState(false);

  useEffect(() => {
    if (tab === 'grupos' && TORNEO_ID) {
      setCargandoGrupos(true);
      getRankingEntreGrupos(TORNEO_ID)
        .then(({ data }) => setRankingGrupos(data.data || []))
        .catch(() => setRankingGrupos([]))
        .finally(() => setCargandoGrupos(false));
    }
  }, [tab]);

  const tabs = [
    { id: 'global',    label: '🌍 Global'      },
    { id: 'grupos',    label: '👥 Entre grupos' },
    { id: 'final',     label: '🏆 Pronóstico final' },
    { id: 'evolucion', label: '📈 Mi evolución' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-white">🏆 Rankings</h1>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white border border-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'global'    && <RankingGlobal rankings={rankings} cargando={cargandoGlobal} />}
      {tab === 'grupos'    && <RankingGrupos rankings={rankingGrupos} cargando={cargandoGrupos} />}
      {tab === 'final'     && <StatsPronosticoFinal />}
      {tab === 'evolucion' && usuario && <EvolucionGrafico usuarioId={usuario.id} torneoId={TORNEO_ID} />}
    </div>
  );
};

export default Rankings;