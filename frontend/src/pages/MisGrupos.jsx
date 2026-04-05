import { useEffect, useState } from 'react';
import { getGrupos } from '../services/grupoService';
import CrearGrupo from '../components/grupos/CrearGrupo';
import UnirseGrupo from '../components/grupos/UnirseGrupo';
import GrupoCard from '../components/grupos/GrupoCard';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import useNotificaciones from '../hooks/useNotificaciones';

const MisGrupos = () => {
  const [grupos, setGrupos]       = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [modalCrear, setModalCrear]   = useState(false);
  const [modalUnirse, setModalUnirse] = useState(false);
  const { error }                 = useNotificaciones();

  const cargarGrupos = () => {
    setCargando(true);
    getGrupos()
      .then(({ data }) => setGrupos(data.data))
      .catch(() => error('Error al cargar grupos'))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargarGrupos(); }, []);

  if (cargando) return <Loading />;

  return (
    <div className="flex flex-col gap-5">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">👥 Mis Grupos</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setModalUnirse(true)}>
            + Unirse
          </Button>
          <Button onClick={() => setModalCrear(true)}>
            + Crear grupo
          </Button>
        </div>
      </div>

      {/* Nota discreta sobre el plan gratuito */}
      <p className="text-xs text-gray-500 -mt-2">
        Plan gratuito: grupos de hasta 5 miembros · 
        <span className="text-yellow-500"> Upgrade disponible para más</span>
      </p>

      {grupos.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/40 border border-gray-700 rounded-xl">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-400">Todavía no estás en ningún grupo</p>
          <p className="text-sm text-gray-500 mt-1">
            Creá un grupo o unite a uno con un código de invitación
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {grupos.map((g) => (
            <GrupoCard key={g._id} grupo={g} />
          ))}
        </div>
      )}

      <CrearGrupo
        abierto={modalCrear}
        onCerrar={() => setModalCrear(false)}
        onGrupoCreado={cargarGrupos}
      />
      <UnirseGrupo
        abierto={modalUnirse}
        onCerrar={() => setModalUnirse(false)}
        onUnido={cargarGrupos}
      />
    </div>
  );
};

export default MisGrupos;