import { getBandera } from '../../utils/banderas';

// Todos los equipos para mostrar el nombre completo
const NOMBRES = {
  ARG: 'Argentina', BRA: 'Brasil', FRA: 'Francia', ENG: 'Inglaterra',
  ESP: 'España', GER: 'Alemania', POR: 'Portugal', NED: 'Países Bajos',
  BEL: 'Bélgica', CRO: 'Croacia', URU: 'Uruguay', COL: 'Colombia',
  MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', AUS: 'Australia',
  JPN: 'Japón', KOR: 'Corea del Sur', MAR: 'Marruecos', SEN: 'Senegal',
  GHA: 'Ghana', EGY: 'Egipto', TUN: 'Túnez', ALG: 'Argelia',
  CIV: 'Costa de Marfil', RSA: 'Sudáfrica', NOR: 'Noruega', SWE: 'Suecia',
  SUI: 'Suiza', AUT: 'Austria', CZE: 'Rep. Checa', TUR: 'Turquía',
  IRN: 'Irán', KSA: 'Arabia Saudita', JOR: 'Jordania', QAT: 'Qatar',
  NZL: 'Nueva Zelanda', ECU: 'Ecuador', PAR: 'Paraguay', PAN: 'Panamá',
  HAI: 'Haití', SCO: 'Escocia', BIH: 'Bosnia y Herz.', CPV: 'Cabo Verde',
  CUW: 'Curazao', UZB: 'Uzbekistán',
};

const PUESTOS = [
  { key: 'campeon', medalla: '🥇', label: 'Campeón',    pts: 7 },
  { key: 'segundo', medalla: '🥈', label: '2do puesto', pts: 7 },
  { key: 'tercero', medalla: '🥉', label: '3er puesto', pts: 7 },
  { key: 'cuarto',  medalla: '4️⃣',  label: '4to puesto', pts: 7 },
];

/**
 * Muestra el pronóstico final del usuario.
 * Props:
 *   pronosticoFinal  — objeto { campeon, segundo, tercero, cuarto, bloqueado, puntosObtenidos }
 *   compact          — boolean, versión pequeña para el Dashboard
 */
const PronosticoFinalCard = ({ pronosticoFinal, compact = false }) => {
  const pf = pronosticoFinal;
  const tienePronostico = pf?.campeon && pf?.segundo && pf?.tercero && pf?.cuarto;

  if (!tienePronostico) return null;

  if (compact) {
    return (
      <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          🏆 Mi pronóstico final
        </p>
        <div className="flex gap-2 flex-wrap">
          {PUESTOS.map(({ key, medalla }) => (
            <div key={key} className="flex items-center gap-1.5 bg-gray-700/40 rounded-lg px-2.5 py-1.5">
              <span className="text-base leading-none">{medalla}</span>
              <span className="text-lg leading-none">{getBandera(pf[key])}</span>
              <span className="text-xs text-gray-300">{NOMBRES[pf[key]] || pf[key]}</span>
            </div>
          ))}
        </div>
        {pf.puntosObtenidos > 0 && (
          <p className="text-xs text-yellow-400 mt-2">
            ⭐ {pf.puntosObtenidos} puntos obtenidos por pronóstico final
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white">🏆 Mi pronóstico final</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Fijado al registrarte · +7 pts por cada acierto
          </p>
        </div>
        {pf.puntosObtenidos > 0 && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-3 py-1.5 text-center">
            <p className="text-yellow-400 font-bold text-lg leading-none">{pf.puntosObtenidos}</p>
            <p className="text-yellow-500/70 text-xs">pts obtenidos</p>
          </div>
        )}
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {PUESTOS.map(({ key, medalla, label, pts }) => {
          const codigo = pf[key];
          return (
            <div
              key={key}
              className="flex items-center gap-3 bg-gray-900/50 rounded-xl p-3 border border-gray-700/50"
            >
              <span className="text-2xl leading-none">{medalla}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{label}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xl leading-none">{getBandera(codigo)}</span>
                  <p className="text-sm font-semibold text-white truncate">
                    {NOMBRES[codigo] || codigo}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-600 shrink-0">+{pts}pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PronosticoFinalCard;