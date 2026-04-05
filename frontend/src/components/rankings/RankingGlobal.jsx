import Loading from '../common/Loading';
import MedallaPuesto from './MedallaPuesto';

// Avatar con fallback a iniciales
const Avatar = ({ src, nombre, username, size = 48 }) => {
  const iniciales = nombre
    ? nombre.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : (username?.[0] || '?').toUpperCase();

  const colores = [
    'from-blue-500 to-blue-700',
    'from-purple-500 to-purple-700',
    'from-green-500 to-green-700',
    'from-orange-500 to-orange-700',
    'from-pink-500 to-pink-700',
    'from-cyan-500 to-cyan-700',
  ];
  const color = colores[(username?.charCodeAt(0) || 0) % colores.length];

  if (src) {
    return (
      <img
        src={src}
        alt={nombre || username}
        style={{ width: size, height: size }}
        className="rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 border-2 border-white shadow-md`}
    >
      <span className="text-white font-bold" style={{ fontSize: size * 0.35 }}>
        {iniciales}
      </span>
    </div>
  );
};

const RankingGlobal = ({ rankings, cargando, error }) => {
  if (cargando) return <Loading texto="Cargando ranking global..." />;

  if (error) return (
    <div className="text-center py-8 text-red-500 bg-red-50 rounded-xl">
      ⚠️ Error: {error}
    </div>
  );

  if (!rankings.length) return (
    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
      <p className="text-4xl mb-2">🏆</p>
      <p>Aún no hay datos de ranking.</p>
      <p className="text-sm mt-2">Los rankings se generan cuando se cargan resultados de partidos.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b bg-gray-50">
        <h2 className="font-semibold text-gray-800">🌍 Ranking Global</h2>
        <p className="text-xs text-gray-500 mt-0.5">Top {rankings.length} participantes</p>
      </div>

      <div className="divide-y">
        {rankings.slice(0, 50).map((r, i) => (
          <div
            key={r._id}
            className={`flex items-center gap-3 px-4 sm:px-5 py-3 transition-colors hover:bg-gray-50 ${
              i < 3 ? 'bg-yellow-50/60' : ''
            }`}
          >
            {/* Posición */}
            <MedallaPuesto posicion={r.posicion || i + 1} size="sm" />

            {/* Avatar grande */}
            <Avatar
              src={r.usuario?.avatar}
              nombre={`${r.usuario?.nombre || ''} ${r.usuario?.apellido || ''}`.trim()}
              username={r.usuario?.username}
              size={48}
            />

            {/* Nombre */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {r.usuario?.nombre} {r.usuario?.apellido}
              </p>
              <p className="text-xs text-gray-400 truncate">@{r.usuario?.username || 'Usuario'}</p>
            </div>

            {/* Puntos */}
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-blue-700">{r.puntaje || 0}</p>
              <p className="text-xs text-gray-400 whitespace-nowrap">
                🎯 {r.desglose?.exactos || 0} &nbsp;✓ {r.desglose?.ganadores || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingGlobal;