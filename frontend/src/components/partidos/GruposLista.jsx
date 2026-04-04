const gruposEquipos = {
  'A': ['Mexico', 'Sudafrica', 'Corea del Sur', 'Republica Checa'],
  'B': ['Canada', 'Qatar', 'Suiza', 'Bosnia y Herzegovina'],
  'C': ['Brasil', 'Marruecos', 'Haiti', 'Escocia'],
  'D': ['Estados Unidos', 'Paraguay', 'Australia', 'Turquia'],
  'E': ['Alemania', 'Curazao', 'Costa de Marfil', 'Ecuador'],
  'F': ['Paises Bajos', 'Japon', 'Tunez', 'Suecia'],
  'G': ['Belgica', 'Egipto', 'Iran', 'Nueva Zelanda'],
  'H': ['Espana', 'Cabo Verde', 'Arabia Saudita', 'Uruguay'],
  'I': ['Francia', 'Senegal', 'Noruega', 'Repechaje 2'],
  'J': ['Argentina', 'Argelia', 'Austria', 'Jordania'],
  'K': ['Portugal', 'Uzbekistan', 'Colombia', 'Repechaje 1'],
  'L': ['Inglaterra', 'Croacia', 'Ghana', 'Panama']
};

const GruposLista = ({ grupoSeleccionado, onSelectGrupo }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {Object.entries(gruposEquipos).map(([grupo, equipos]) => (
        <div 
          key={grupo}
          onClick={() => onSelectGrupo(grupo === grupoSeleccionado ? null : grupo)}
          className={`cursor-pointer rounded-xl p-4 transition-all ${
            grupoSeleccionado === grupo 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white border border-gray-200 hover:shadow-md'
          }`}
        >
          <h3 className={`text-xl font-bold mb-2 ${grupoSeleccionado === grupo ? 'text-white' : 'text-blue-600'}`}>
            Grupo {grupo}
          </h3>
          <div className="space-y-1">
            {equipos.map((equipo, idx) => (
              <p key={idx} className={`text-sm ${grupoSeleccionado === grupo ? 'text-blue-100' : 'text-gray-600'}`}>
                {equipo}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GruposLista;