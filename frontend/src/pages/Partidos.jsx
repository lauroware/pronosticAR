import { useState, useEffect } from 'react';
import usePartidos from '../hooks/usePartidos';
import { getMisPronosticos } from '../services/pronosticoService';
import Calendario from '../components/partidos/Calendario';
import GruposLista from '../components/partidos/GruposLista';
import Loading from '../components/common/Loading';

const ESTADOS = [
  { valor: 'programado', label: 'Próximos' },
  { valor: 'finalizado', label: 'Finalizados' },
  { valor: '',           label: 'Todos' },
];

const Partidos = () => {
  const [estado, setEstado] = useState('programado');
  const [grupo, setGrupo]   = useState(null);

  const filtros = {
    ...(estado && { estado }),
    ...(grupo  && { grupoFase: grupo }),
    limit: 100,
  };

  const { partidos, cargando } = usePartidos(filtros);
  const [pronosticos, setPronosticos] = useState([]);

  useEffect(() => {
    getMisPronosticos().then(({ data }) => setPronosticos(data.data)).catch(() => {});
  }, []);

  const handlePronosticoGuardado = (prono) => {
    setPronosticos((prev) => {
      const key = (p) => p.partido?._id || p.partido;
      const existe = prev.find((p) => key(p) === key(prono));
      return existe
        ? prev.map((p) => (key(p) === key(prono) ? prono : p))
        : [...prev, prono];
    });
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Título — texto blanco sobre fondo oscuro */}
      <h1 className="text-2xl font-bold text-white">⚽ Partidos Mundial 2026</h1>

      {/* Filtros de estado */}
      <div className="flex gap-2 flex-wrap">
        {ESTADOS.map(({ valor, label }) => (
          <button
            key={label}
            onClick={() => setEstado(valor)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              estado === valor
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grupos con equipos */}
      <GruposLista grupoSeleccionado={grupo} onSelectGrupo={setGrupo} />

      {/* Partidos */}
      {cargando ? (
        <Loading />
      ) : (
        <Calendario
          partidos={partidos}
          pronosticos={pronosticos}
          onPronosticoGuardado={handlePronosticoGuardado}
        />
      )}
    </div>
  );
};

export default Partidos;