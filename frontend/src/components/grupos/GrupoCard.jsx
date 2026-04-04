import { Link } from 'react-router-dom';

const GrupoCard = ({ grupo }) => {
  return (
    <Link to={`/grupos/${grupo._id}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-2xl">👥</span>
              <h3 className="font-semibold text-gray-900">{grupo.nombre}</h3>
              {grupo.esPrivado && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">🔒 Privado</span>
              )}
            </div>
            
            {grupo.descripcion && (
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{grupo.descripcion}</p>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-400">
              <span>👥 {grupo.cantidadMiembros || 0} miembros</span>
              <span>👑 Creado por @{grupo.creador?.username || 'admin'}</span>
            </div>
          </div>
          
          <div className="text-left sm:text-right shrink-0">
            <div className="text-sm font-medium text-blue-600">
              {grupo.rolEnGrupo === 'admin' ? 'Admin' : 'Miembro'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GrupoCard;