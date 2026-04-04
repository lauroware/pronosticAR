import PartidoCard from './PartidoCard';

const agruparPorFecha = (partidos) => {
  const grupos = {};
  partidos.forEach((p) => {
    const fecha = new Date(p.fechaHora).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!grupos[fecha]) grupos[fecha] = [];
    grupos[fecha].push(p);
  });
  return grupos;
};

const Calendario = ({ partidos, pronosticos, onPronosticoGuardado }) => {
  const agrupados = agruparPorFecha(partidos);
  const pronosticoMap = pronosticos.reduce((acc, p) => { acc[p.partido?._id || p.partido] = p; return acc; }, {});

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(agrupados).map(([fecha, ps]) => (
        <div key={fecha}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 capitalize">{fecha}</h3>
          <div className="flex flex-col gap-3">
            {ps.map((partido) => (
              <PartidoCard key={partido._id} partido={partido}
                miPronostico={pronosticoMap[partido._id]}
                onPronosticoGuardado={onPronosticoGuardado} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Calendario;