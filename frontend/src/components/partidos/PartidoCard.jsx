import { useState } from 'react';
import { crearPronostico } from '../../services/pronosticoService';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const PartidoCard = ({ partido, miPronostico, onPronosticoGuardado }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [golesLocal, setGolesLocal] = useState(miPronostico?.prediccion?.golesLocal || '');
  const [golesVisitante, setGolesVisitante] = useState(miPronostico?.prediccion?.golesVisitante || '');
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotificaciones();

  const estaAbierto = partido.estaAbierto && partido.estado !== 'finalizado';
  const yaPronosticado = !!miPronostico?.prediccion;

  const handleGuardar = async () => {
    if (golesLocal === '' || golesVisitante === '') return error('Completá ambos marcadores');
    setLoading(true);
    try {
      const { data } = await crearPronostico({
        partidoId: partido._id,
        golesLocal: Number(golesLocal),
        golesVisitante: Number(golesVisitante),
      });
      success('¡Pronóstico guardado!');
      onPronosticoGuardado?.(data.data);
      setModalAbierto(false);
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Local */}
          <div className="flex-1 text-center sm:text-right">
            <p className="font-semibold text-gray-900 text-sm sm:text-base">{partido.equipoLocal.nombre}</p>
            <p className="text-xs text-gray-400">{partido.equipoLocal.codigoPais}</p>
          </div>
          
          {/* Marcador / Hora */}
          <div className="text-center min-w-[80px]">
            {partido.estado === 'finalizado' ? (
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {partido.resultado?.golesLocal} - {partido.resultado?.golesVisitante}
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-gray-400">
                {new Date(partido.fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            {yaPronosticado && partido.estado !== 'finalizado' && (
              <div className="text-xs text-green-600 mt-1 whitespace-nowrap">
                Tu: {miPronostico.prediccion.golesLocal}-{miPronostico.prediccion.golesVisitante}
              </div>
            )}
          </div>
          
          {/* Visitante */}
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-gray-900 text-sm sm:text-base">{partido.equipoVisitante.nombre}</p>
            <p className="text-xs text-gray-400">{partido.equipoVisitante.codigoPais}</p>
          </div>
          
          {/* Botón */}
          {estaAbierto && (
            <Button 
              size="sm" 
              variant={yaPronosticado ? 'secondary' : 'primary'} 
              onClick={() => setModalAbierto(true)}
              className="shrink-0 w-full sm:w-auto"
            >
              {yaPronosticado ? 'Editar' : 'Pronosticar'}
            </Button>
          )}
        </div>
        
        {/* Resultado del pronóstico (si finalizó) */}
        {partido.estado === 'finalizado' && miPronostico?.puntos !== undefined && (
          <div className="mt-2 text-center text-xs border-t pt-2">
            {miPronostico.puntos === 3 && <span className="text-green-600">🎯 Exacto +3 pts</span>}
            {miPronostico.puntos === 1 && <span className="text-blue-600">✓ Ganador +1 pt</span>}
            {miPronostico.puntos === 0 && <span className="text-gray-400">✗ Fallo</span>}
          </div>
        )}
      </div>

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} titulo="Hacé tu pronóstico" size="sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Input 
            label={partido.equipoLocal.nombre} 
            type="number" 
            min="0" 
            max="30" 
            value={golesLocal} 
            onChange={(e) => setGolesLocal(e.target.value)} 
            className="w-full sm:w-28 text-center" 
          />
          <span className="text-2xl font-bold text-gray-400">-</span>
          <Input 
            label={partido.equipoVisitante.nombre} 
            type="number" 
            min="0" 
            max="30" 
            value={golesVisitante} 
            onChange={(e) => setGolesVisitante(e.target.value)} 
            className="w-full sm:w-28 text-center" 
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
          <Button variant="ghost" onClick={() => setModalAbierto(false)} className="w-full sm:w-auto">Cancelar</Button>
          <Button onClick={handleGuardar} loading={loading} className="w-full sm:w-auto">Guardar pronóstico</Button>
        </div>
      </Modal>
    </>
  );
};

export default PartidoCard;