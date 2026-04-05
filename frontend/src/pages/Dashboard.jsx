import useAuth from '../hooks/useAuth';
import usePartidos from '../hooks/usePartidos';
import { getRankingGlobal } from '../services/rankingService';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/common/Loading';
import PartidoCard from '../components/partidos/PartidoCard';
import { getMisPronosticos } from '../services/pronosticoService';

const TORNEO_ID = import.meta.env.VITE_TORNEO_ID || '';

// Devuelve sólo los partidos de la fecha más próxima con partidos programados
const filtrarProximaFecha = (partidos) => {
  if (!partidos?.length) return [];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Agrupar por fecha (YYYY-MM-DD)
  const porFecha = {};
  partidos.forEach((p) => {
    const d = new Date(p.fechaHora);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().split('T')[0];
    if (!porFecha[key]) porFecha[key] = [];
    porFecha[key].push(p);
  });

  // Ordenar fechas y tomar la más próxima >= hoy
  const fechas = Object.keys(porFecha).sort();
  const proxima = fechas.find((f) => new Date(f) >= hoy) || fechas[0];
  return proxima ? porFecha[proxima] : [];
};

const QuickCard = ({ to, emoji, titulo, subtitulo, color }) => (
  <Link
    to={to}
    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${color}`}
  >
    <span className="text-3xl">{emoji}</span>
    <div>
      <p className="font-bold text-white text-sm">{titulo}</p>
      <p className="text-xs text-white/70 mt-0.5">{subtitulo}</p>
    </div>
    <span className="ml-auto text-white/50 text-lg">→</span>
  </Link>
);

const Dashboard = () => {
  const { usuario } = useAuth();
  const { partidos, cargando: cargandoPartidos } = usePartidos({ estado: 'programado', limit: 50 });
  const [pronosticos, setPronosticos] = useState([]);
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    getMisPronosticos(TORNEO_ID).then(({ data }) => setPronosticos(data.data)).catch(() => {});
    getRankingGlobal(TORNEO_ID, 1).then(({ data }) => {
      const miRanking = data.data.find((r) => r.usuario?._id === usuario?.id);
      setRanking(miRanking);
    }).catch(() => {});
  }, [usuario?.id]);

  const pronosticoMap = pronosticos.reduce((acc, p) => {
    acc[p.partido?._id || p.partido] = p;
    return acc;
  }, {});

  const proximaFechaPartidos = filtrarProximaFecha(partidos);

  // Fecha legible del grupo de partidos
  const fechaLabel = proximaFechaPartidos[0]
    ? new Date(proximaFechaPartidos[0].fechaHora).toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long',
      })
    : null;

  return (
    <div className="flex flex-col gap-6">

      {/* ── BIENVENIDA ── */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">¡Hola, {usuario?.nombre}! 👋</h1>
            <p className="text-blue-100 mt-1 text-sm max-w-sm">
              Hacé tus pronósticos, competí con tus amigos o tu grupo de trabajo y escalá en el ranking.
              Creá un grupo, compartí el código y que empiece la competencia. 🏆
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <div className="bg-white/20 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold leading-none">{ranking?.puntaje ?? 0}</p>
              <p className="text-xs text-blue-100 mt-1">Puntos</p>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold leading-none">#{ranking?.posicion ?? '–'}</p>
              <p className="text-xs text-blue-100 mt-1">Posición</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACCESOS RÁPIDOS ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickCard
            to="/partidos"
            emoji="⚽"
            titulo="Pronosticar"
            subtitulo="Cargá tus picks"
            color="bg-gradient-to-br from-green-600 to-emerald-700 border-green-500/30"
          />
          <QuickCard
            to="/grupos"
            emoji="👥"
            titulo="Mis Grupos"
            subtitulo="Ver o crear grupos"
            color="bg-gradient-to-br from-purple-600 to-violet-700 border-purple-500/30"
          />
          <QuickCard
            to="/rankings"
            emoji="🏆"
            titulo="Ranking"
            subtitulo="¿Cómo venís?"
            color="bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-500/30"
          />
          <QuickCard
            to="/novedades"
            emoji="📰"
            titulo="Novedades"
            subtitulo="Últimas noticias"
            color="bg-gradient-to-br from-sky-600 to-cyan-700 border-sky-500/30"
          />
        </div>
      </div>

      {/* ── PRÓXIMOS PARTIDOS (solo la fecha más cercana) ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">⚽ Próximos partidos</h2>
            {fechaLabel && (
              <p className="text-xs text-gray-500 mt-0.5 capitalize">{fechaLabel}</p>
            )}
          </div>
          <Link to="/partidos" className="text-sm text-blue-500 hover:text-blue-400 font-medium">
            Ver todos →
          </Link>
        </div>

        {cargandoPartidos ? (
          <Loading />
        ) : proximaFechaPartidos.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">📅</p>
            <p className="text-sm">No hay partidos programados próximamente.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {proximaFechaPartidos.map((p) => (
              <PartidoCard key={p._id} partido={p} miPronostico={pronosticoMap[p._id]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;