import MedallaPuesto from './MedallaPuesto';
import Loading from '../common/Loading';

const RankingInterno = ({ miembros, cargando, titulo = '🏆 Ranking interno' }) => {
  if (cargando) return <Loading />;
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b bg-gray-50">
        <h2 className="font-semibold text-gray-800">{titulo}</h2>
      </div>
      <div className="divide-y">
        {miembros.map((m, i) => (
          <div key={m._id} className={`flex items-center gap-3 px-5 py-3 ${i < 3 ? 'bg-yellow-50/50' : ''}`}>
            <MedallaPuesto posicion={m.posicion || i + 1} />
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
              {m.usuario?.nombre?.[0]}{m.usuario?.apellido?.[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">@{m.usuario?.username}</p>
              <p className="text-xs text-gray-400">{m.usuario?.nombre} {m.usuario?.apellido}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-700">{m.puntajeEnGrupo}</p>
              <p className="text-xs text-gray-400">pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RankingInterno;