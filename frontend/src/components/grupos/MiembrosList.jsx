const MiembrosList = ({ miembros }) => {
  const admins = miembros.filter(m => m.rol === 'admin');
  const normales = miembros.filter(m => m.rol === 'miembro');

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b bg-gray-50">
        <h2 className="font-semibold text-gray-800">👥 Miembros del grupo</h2>
        <p className="text-xs text-gray-500 mt-0.5">{miembros.length} participantes</p>
      </div>
      
      <div className="divide-y">
        {admins.map((m) => (
          <div key={m._id} className="flex items-center gap-3 px-5 py-3 bg-blue-50/30">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {m.usuario?.nombre?.[0]}{m.usuario?.apellido?.[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">@{m.usuario?.username}</p>
              <p className="text-xs text-gray-500">{m.usuario?.nombre} {m.usuario?.apellido}</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Admin</span>
          </div>
        ))}
        
        {normales.map((m) => (
          <div key={m._id} className="flex items-center gap-3 px-5 py-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-bold">
              {m.usuario?.nombre?.[0]}{m.usuario?.apellido?.[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">@{m.usuario?.username}</p>
              <p className="text-xs text-gray-500">{m.usuario?.nombre} {m.usuario?.apellido}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-blue-600">{m.puntajeEnGrupo} pts</p>
              <p className="text-xs text-gray-400">Pos #{m.posicion || '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiembrosList;