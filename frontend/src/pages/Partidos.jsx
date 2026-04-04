import { useState, useEffect } from 'react';
import usePartidos from '../hooks/usePartidos';
import { getMisPronosticos } from '../services/pronosticoService';
import Calendario from '../components/partidos/Calendario';
import GruposLista from '../components/partidos/GruposLista';
import Loading from '../components/common/Loading';

const ESTADOS = [
  { valor: 'programado', label: 'Próximos' },
  { valor: 'finalizado', label: 'Finalizados' },
  { valor: '', label: 'Todos' },
];

const Partidos = () => {
  const [estado, setEstado] = useState('programado');
  const [grupo, setGrupo] = useState(null);
  
  const filtros = { 
    ...(estado && { estado }), 
    ...(grupo && { grupoFase: grupo }),
    limit: 100  // Para que traiga todos
  };
  
  const { partidos, cargando } = usePartidos(filtros);
  const [pronosticos, setPronosticos] = useState([]);

  useEffect(() => {
    getMisPronosticos().then(({ data }) => setPronosticos(data.data)).catch(() => {});
  }, []);

  const handlePronosticoGuardado = (prono) => {
    setPronosticos((prev) => {
      const existe = prev.find((p) => (p.partido?._id || p.partido) === (prono.partido?._id || prono.partido));
      return existe ? prev.map((p) => (p.partido?._id || p.partido) === (prono.partido?._id || prono.partido) ? prono : p) : [...prev, prono];
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-gray-900">⚽ Partidos Mundial 2026</h1>

      {/* Selector de estado */}
      <div className="flex gap-2 flex-wrap">
        {ESTADOS.map(({ valor, label }) => (
          <button key={label} onClick={() => setEstado(valor)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              estado === valor ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Grupos con equipos */}
      <GruposLista grupoSeleccionado={grupo} onSelectGrupo={setGrupo} />

      {/* Calendario de partidos */}
      {cargando ? <Loading /> : (
        <Calendario partidos={partidos} pronosticos={pronosticos} onPronosticoGuardado={handlePronosticoGuardado} />
      )}
    </div>
  );
};

export default Partidos;