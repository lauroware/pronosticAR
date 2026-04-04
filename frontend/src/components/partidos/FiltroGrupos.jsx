const GRUPOS = ['A','B','C','D','E','F'];

const FiltroGrupos = ({ activo, onChange }) => (
  <div className="flex gap-2 flex-wrap">
    <button onClick={() => onChange(null)}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!activo ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
      Todos
    </button>
    {GRUPOS.map((g) => (
      <button key={g} onClick={() => onChange(g)}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activo === g ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
        Grupo {g}
      </button>
    ))}
  </div>
);
export default FiltroGrupos;