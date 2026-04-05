import { useEffect, useState } from 'react';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { getBandera } from '../../utils/banderas';

const NOMBRES = {
  ARG: 'Argentina', BRA: 'Brasil', FRA: 'Francia', ENG: 'Inglaterra',
  ESP: 'España', GER: 'Alemania', POR: 'Portugal', NED: 'Países Bajos',
  BEL: 'Bélgica', CRO: 'Croacia', URU: 'Uruguay', COL: 'Colombia',
  MEX: 'México', USA: 'Est. Unidos', CAN: 'Canadá', AUS: 'Australia',
  JPN: 'Japón', KOR: 'Corea del Sur', MAR: 'Marruecos', SEN: 'Senegal',
  GHA: 'Ghana', EGY: 'Egipto', TUN: 'Túnez', ALG: 'Argelia',
  CIV: 'Costa de Marfil', RSA: 'Sudáfrica', NOR: 'Noruega', SWE: 'Suecia',
  SUI: 'Suiza', AUT: 'Austria', CZE: 'Rep. Checa', TUR: 'Turquía',
  IRN: 'Irán', KSA: 'Arabia Saudita', JOR: 'Jordania', QAT: 'Qatar',
  NZL: 'Nueva Zelanda', ECU: 'Ecuador', PAR: 'Paraguay', PAN: 'Panamá',
  HAI: 'Haití', SCO: 'Escocia', BIH: 'Bosnia', CPV: 'Cabo Verde',
  CUW: 'Curazao', UZB: 'Uzbekistán',
};

const PUESTOS = [
  { key: 'campeon', medalla: '🥇', label: 'Campeón'    },
  { key: 'segundo', medalla: '🥈', label: '2do puesto' },
  { key: 'tercero', medalla: '🥉', label: '3er puesto' },
  { key: 'cuarto',  medalla: '4️⃣',  label: '4to puesto' },
];

// Barra de porcentaje
const BarraPct = ({ pct, esTop }) => (
  <div className="flex items-center gap-2 mt-1">
    <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${esTop ? 'bg-blue-500' : 'bg-gray-600'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
    <span className="text-xs text-gray-400 w-8 text-right shrink-0">{pct}%</span>
  </div>
);

const StatsPronosticoFinal = () => {
  const { usuario }     = useAuth();
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get('/rankings/stats-pronostico-final')
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const pf = usuario?.pronosticoFinal;
  const tienePronostico = pf?.campeon && pf?.segundo && pf?.tercero && pf?.cuarto;

  if (cargando) return (
    <div className="h-32 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">

      {/* ── MIS ELECCIONES ── */}
      {tienePronostico && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-700">
            <h3 className="font-bold text-white text-sm">🎯 Mis elecciones</h3>
            <p className="text-xs text-gray-400 mt-0.5">+7 pts por cada acierto · No editables</p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            {PUESTOS.map(({ key, medalla, label }) => (
              <div key={key} className="flex items-center gap-3 bg-gray-900/50 rounded-xl p-3 border border-gray-700/50">
                <span className="text-2xl leading-none">{medalla}</span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{label}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xl leading-none">{getBandera(pf[key])}</span>
                    <p className="text-sm font-semibold text-white truncate">
                      {NOMBRES[pf[key]] || pf[key]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {pf.puntosObtenidos > 0 && (
            <div className="px-5 pb-4">
              <div className="bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-4 py-2 text-center">
                <p className="text-yellow-400 text-sm font-semibold">
                  ⭐ Obtuviste {pf.puntosObtenidos} puntos por tus aciertos
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STATS DEL SITIO ── */}
      {stats && stats.total > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">📊 Lo que eligió la comunidad</h3>
            <span className="text-xs text-gray-500">{stats.total} participantes</span>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PUESTOS.map(({ key, medalla, label }) => {
              const lista = stats[key] || [];
              const top   = lista[0];
              const resto = lista.slice(1);

              return (
                <div key={key}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {medalla} {label}
                  </p>

                  {/* Top 1 — grande */}
                  {top && (
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl leading-none">{getBandera(top.codigo)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold truncate">{NOMBRES[top.codigo] || top.codigo}</p>
                        <BarraPct pct={top.porcentaje} esTop />
                      </div>
                    </div>
                  )}

                  {/* Resto — más chicos */}
                  <div className="space-y-2">
                    {resto.map((e) => (
                      <div key={e.codigo} className="flex items-center gap-2">
                        <span className="text-xl leading-none">{getBandera(e.codigo)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 truncate">{NOMBRES[e.codigo] || e.codigo}</p>
                          <BarraPct pct={e.porcentaje} esTop={false} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats && stats.total === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p className="text-3xl mb-2">📊</p>
          <p className="text-sm">Todavía no hay pronósticos finales registrados.</p>
        </div>
      )}
    </div>
  );
};

export default StatsPronosticoFinal;