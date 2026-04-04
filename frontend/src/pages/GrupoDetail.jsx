import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGrupo, getMiembros } from '../services/grupoService';
import RankingInterno from '../components/rankings/RankingInterno';
import InvitacionModal from '../components/grupos/InvitacionModal';
import Loading from '../components/common/Loading';
import useNotificaciones from '../hooks/useNotificaciones';
import Button from '../components/common/Button';

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
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">👥</div>
            <div>
              <h1 className="text-2xl font-bold">{grupo.nombre}</h1>
              {grupo.descripcion && <p className="text-blue-200 text-sm mt-1">{grupo.descripcion}</p>}
              <p className="text-blue-300 text-xs mt-1">{grupo.cantidadMiembros} miembros</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setModalInvitacion(true)}
            className="text-white border-white/30 hover:bg-white/10">
            Invitar
          </Button>
        </div>

        <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-200">Código de invitación</p>
            <p className="text-xl font-mono font-bold tracking-widest">{grupo.codigoInvitacion}</p>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(grupo.codigoInvitacion); }}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
            Copiar
          </button>
        </div>
      </div>

      <RankingInterno miembros={miembros} cargando={false} titulo="🏆 Ranking del grupo" />

      <InvitacionModal grupo={grupo} abierto={modalInvitacion} onCerrar={() => setModalInvitacion(false)} />
    </div>
  );
};

export default GrupoDetail;