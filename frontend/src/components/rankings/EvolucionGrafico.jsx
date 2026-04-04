import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getEvolucion } from '../../services/rankingService';
import Loading from '../common/Loading';

const EvolucionGrafico = ({ usuarioId, torneoId, grupoId }) => {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuarioId || !torneoId) {
      setCargando(false);
      return;
    }
    
    getEvolucion(usuarioId, torneoId, grupoId)
      .then(({ data }) => {
        if (data.data && data.data.length > 0) {
          const evolucion = data.data.map((h, i) => ({
            partido: `P${i + 1}`,
            posicion: h.posicion,
            puntaje: h.puntaje,
            ganados: h.puntajePartido || 0,
          }));
          setDatos(evolucion);
        } else {
          setDatos([]);
        }
      })
      .catch((err) => {
        console.error('Error cargando evolución:', err);
        setDatos([]);
      })
      .finally(() => setCargando(false));
  }, [usuarioId, torneoId, grupoId]);

  if (cargando) return <Loading texto="Cargando evolución..." />;
  
  if (!datos.length) return (
    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
      📊 Aún no hay historial. Se genera tras cada partido finalizado.
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-800 mb-4">📈 Evolución de posición</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={datos} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="partido" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="posicion" 
            stroke="#2563eb" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            name="Posición" 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="puntaje" 
            stroke="#16a34a" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            name="Puntos acumulados" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvolucionGrafico;