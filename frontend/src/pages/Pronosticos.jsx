import { useEffect, useState } from 'react';
import { getMisPronosticos } from '../services/pronosticoService';
import Loading from '../components/common/Loading';

const TORNEO_ID = import.meta.env.VITE_TORNEO_ID || '';

const Pronosticos = () => {
  const [pronosticos, setPronosticos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getMisPronosticos(TORNEO_ID)
      .then(({ data }) => setPronosticos(data.data))
      .catch(() => setPronosticos([]))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <Loading />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">🎯 Mis Pronósticos</h1>
      
      {pronosticos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-400">Todavía no hiciste ningún pronóstico</p>
          <p className="text-sm text-gray-400 mt-1">Andá a la sección Partidos y empezá a predecir</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="divide-y">
            {pronosticos.map((p) => (
              <div key={p._id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {p.partido?.equipoLocal?.nombre} vs {p.partido?.equipoVisitante?.nombre}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(p.partido?.fechaHora).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">
                      {p.prediccion?.golesLocal} - {p.prediccion?.golesVisitante}
                    </p>
                    {p.puntos !== null && (
                      <p className="text-xs font-medium">
                        {p.puntos === 3 && <span className="text-green-600">+3 pts (Exacto)</span>}
                        {p.puntos === 1 && <span className="text-blue-600">+1 pt (Ganador)</span>}
                        {p.puntos === 0 && <span className="text-gray-400">0 pts</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pronosticos;