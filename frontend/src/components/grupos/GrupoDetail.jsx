import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGrupo, getMiembros } from '../../services/grupoService';
import { getRankingGrupo } from '../../services/rankingService';
import RankingInterno from '../rankings/RankingInterno';
import InvitacionModal from './InvitacionModal';
import MiembrosList from './MiembrosList';
import Loading from '../common/Loading';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';

const GrupoDetail = () => {
  const { id } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalInvitacion, setModalInvitacion] = useState(false);
  const { error } = useNotificaciones();

  useEffect(() => {
    Promise.all([getGrupo(id), getMiembros(id)])
      .then(([{ data: g }, { data: m }]) => {
        setGrupo(g.data);
        setMiembros(m.data);
      })
      .catch(() => error('No se pudo cargar el grupo'))
      .finally(() => setCargando(false));
  }, [id, error]);

  if (cargando) return <Loading />;
  if (!grupo) return <div className="text-center py-12 text-gray-400">Grupo no encontrado</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* Header del grupo */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              👥
            </div>
            <div>
              <h1 className="text-2xl font-bold">{grupo.nombre}</h1>
              {grupo.descripcion && (
                <p className="text-blue-200 text-sm mt-1">{grupo.descripcion}</p>
              )}
              <div className="flex items-center gap-3 mt-2 text-sm text-blue-200">
                <span>👥 {grupo.cantidadMiembros} miembros</span>
                <span>🔑 Código: {grupo.codigoInvitacion}</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalInvitacion(true)}
            className="text-white border-white/30 hover:bg-white/10"
          >
            📋 Invitar amigos
          </Button>
        </div>
      </div>

      {/* Ranking interno del grupo */}
      <RankingInterno 
        miembros={miembros} 
        cargando={false} 
        titulo="🏆 Ranking del grupo" 
      />

      {/* Lista de miembros */}
      <MiembrosList miembros={miembros} />

      {/* Modal de invitación */}
      <InvitacionModal 
        grupo={grupo} 
        abierto={modalInvitacion} 
        onCerrar={() => setModalInvitacion(false)} 
      />
    </div>
  );
};

export default GrupoDetail;