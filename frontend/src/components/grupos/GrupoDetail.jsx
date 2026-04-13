import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGrupo, getMiembros } from '../services/grupoService';
import RankingInterno from '../components/rankings/RankingInterno';
import InvitacionModal from '../components/grupos/InvitacionModal';
import UpgradeModal from '../components/grupos/UpgradeModal';
import Loading from '../components/common/Loading';
import useNotificaciones from '../hooks/useNotificaciones';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';

const GrupoDetail = () => {
  const { id }                        = useParams();
  const { usuario }                   = useAuth();
  const [grupo, setGrupo]             = useState(null);
  const [miembros, setMiembros]       = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [modalInvitacion, setModalInvitacion] = useState(false);
  const [modalUpgrade, setModalUpgrade]       = useState(false);
  const { error }                     = useNotificaciones();

  const cargar = () => {
    Promise.all([getGrupo(id), getMiembros(id)])
      .then(([{ data: g }, { data: m }]) => {
        setGrupo(g.data);
        setMiembros(m.data);
      })
      .catch(() => error('No se pudo cargar el grupo'))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, [id]);

  if (cargando) return <Loading />;
  if (!grupo)   return <div className="text-center py-12 text-gray-400">Grupo no encontrado</div>;

  const esAdmin     = grupo.creador?._id === usuario?.id || grupo.rolEnGrupo === 'admin';
  
  return (
    <div className="flex flex-col gap-5">

      {/* Header del grupo */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {grupo.imagen ? (
              <img src={grupo.imagen} alt={grupo.nombre}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/30" />
            ) : (
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                👥
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{grupo.nombre}</h1>
                {/* Badge premium discreto */}
                {grupo.premium && (
                  <span className="text-xs bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-2 py-0.5 rounded-full">
                    ⭐ Premium
                  </span>
                )}
              </div>
              {grupo.descripcion && (
                <p className="text-blue-200 text-sm mt-1">{grupo.descripcion}</p>
              )}
              <p className="text-blue-300 text-xs mt-1">
                {grupo.cantidadMiembros}/{limiteActual} miembros
              </p>
            </div>
          </div>
          <Button
            variant="ghost" size="sm"
            onClick={() => setModalInvitacion(true)}
            className="text-white border-white/30 hover:bg-white/10"
          >
            Invitar
          </Button>
        </div>

        {/* Código de invitación */}
        <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-200">Código de invitación</p>
            <p className="text-xl font-mono font-bold tracking-widest">{grupo.codigoInvitacion}</p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(grupo.codigoInvitacion)}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            Copiar
          </button>
        </div>
      </div>

      {/* Banner de upgrade — solo para admin cuando el grupo está lleno y no es premium */}
      {esAdmin && grupoLleno && !grupo.premium && (
        <div className="flex items-center justify-between gap-3 bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">⚡</span>
            <p className="text-sm text-yellow-300">
            
            </p>
          </div>
          <button
            onClick={() => setModalUpgrade(true)}
            className="shrink-0 text-xs font-semibold bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Ver upgrade
          </button>
        </div>
      )}

      <RankingInterno miembros={miembros} cargando={false} titulo="🏆 Ranking del grupo" />

      <InvitacionModal
        grupo={grupo}
        abierto={modalInvitacion}
        onCerrar={() => setModalInvitacion(false)}
      />

    //  <UpgradeModal
       //  abierto={modalUpgrade}
       //  onCerrar={() => setModalUpgrade(false)}
     //    grupoId={grupo._id}
     //    grupoNombre={grupo.nombre}
     //    esAdmin={esAdmin}
      />
    // </div>
  );
};

export default GrupoDetail;