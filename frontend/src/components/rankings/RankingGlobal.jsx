import Loading from '../common/Loading';
import MedallaPuesto from './MedallaPuesto';

const RankingGlobal = ({ rankings, cargando, error }) => {
  if (cargando) return <Loading texto="Cargando ranking global..." />;
  
  if (error) return (
    <div className="text-center py-8 text-red-500 bg-red-50 rounded-xl">
      ⚠️ Error: {error}
    </div>
  );
  
  if (!rankings.length) return (
    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
      🏆 Aún no hay datos de ranking. 
      <p className="text-sm mt-2">Los rankings se generan cuando se cargan resultados de partidos.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b bg-gray-50">
        <h2 className="font-semibold text-gray-800">🌍 Ranking Global</h2>
        <p className="text-xs text-gray-500 mt-0.5">Top {rankings.length} participantes</p>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[400px] divide-y">
          {rankings.slice(0, 50).map((r, i) => (
            <div key={r._id} className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 ${i < 3 ? 'bg-yellow-50/50' : ''}`}>
              <MedallaPuesto posicion={r.posicion || i + 1} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">@{r.usuario?.username || 'Usuario'}</p>
                <p className="text-xs text-gray-400 truncate hidden sm:block">{r.usuario?.nombre} {r.usuario?.apellido}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg sm:text-xl font-bold text-blue-700">{r.puntaje || 0}</p>
                <p className="text-xs text-gray-400 whitespace-nowrap">
                  🎯 {r.desglose?.exactos || 0} | ✓ {r.desglose?.ganadores || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingGlobal;