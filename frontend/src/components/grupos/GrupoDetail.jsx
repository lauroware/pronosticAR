import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGrupo, getMiembros } from '../services/grupoService';
import MiembrosList from '../components/grupos/MiembrosList';
import Loading from '../components/common/Loading';
import useNotificaciones from '../hooks/useNotificaciones';

const GrupoDetail = () => {
  const { id } = useParams();
  const [grupo, setGrupo]     = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { error } = useNotificaciones();

  useEffect(() => {
    const cargar = async () => {
      try {
        const [{ data: g }, { data: m }] = await Promise.all([getGrupo(id), getMiembros(id)]);
        setGrupo(g.data);
        setMiembros(m.data);
      } catch (err) {
        error('No se pudo cargar el grupo');
      } finally { setCargando(false); }
    };
    cargar();
  }, [id]);

  if (cargando) return <Loading />;
  if (!grupo) return <div className="text-center py-12 text-gray-400">Grupo no encontrado</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* Header del grupo */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">👥</div>
          <div>
            <h1 className="text-2xl font-bold">{grupo.nombre}</h1>
            {grupo.descripcion && <p className="text-blue-200 text-sm mt-1">{grupo.descripcion}</p>}
            <p className="text-blue-300 text-xs mt-1">{grupo.cantidadMiembros} miembros</p>
          </div>
        </div>

        {/* Código de invitación */}
        <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-200">Código de invitación</p>
            <p className="text-xl font-mono font-bold tracking-widest">{grupo.codigoInvitacion}</p>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(grupo.codigoInvitacion); }}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            Copiar
          </button>
        </div>
      </div>

      {/* Ranking interno */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">🏆 Ranking del grupo</h2>
        </div>
        <div className="px-5 py-2">
          {miembros.length === 0 ? (
            <div className="py-8 text-center text-gray-400">Sin miembros todavía</div>
          ) : (
            <MiembrosList miembros={miembros} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GrupoDetail;