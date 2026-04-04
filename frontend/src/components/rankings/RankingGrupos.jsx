import Loading from '../common/Loading';

const RankingGrupos = ({ rankings, cargando }) => {
  if (cargando) return <Loading />;
  if (!rankings.length) return <div className="text-center py-8 text-gray-400">Sin datos de grupos todavía</div>;
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b bg-gray-50">
        <h2 className="font-semibold text-gray-800">👥 Ranking entre grupos</h2>
        <p className="text-xs text-gray-500 mt-0.5">Ordenado por promedio de puntos por miembro</p>
      </div>
      <div className="divide-y">
        {rankings.map((r, i) => (
          <div key={r._id} className="flex items-center gap-4 px-5 py-3">
            <span className="text-lg font-bold text-gray-400 w-6">#{i + 1}</span>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{r.grupo?.nombre}</p>
              <p className="text-xs text-gray-400">{r.cantidadMiembros} miembros</p>
            </div>
            {r.posicionAnterior && r.posicion < r.posicionAnterior && <span className="text-green-500 text-xs">▲</span>}
            {r.posicionAnterior && r.posicion > r.posicionAnterior && <span className="text-red-400 text-xs">▼</span>}
            <div className="text-right">
              <p className="text-lg font-bold text-blue-700">{r.promedioPorMiembro.toFixed(1)}</p>
              <p className="text-xs text-gray-400">pts/miembro</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RankingGrupos;