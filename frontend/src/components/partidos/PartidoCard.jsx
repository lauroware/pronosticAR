import { useState } from 'react';
import { crearPronostico } from '../../services/pronosticoService';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const PartidoCard = ({ partido, miPronostico, onPronosticoGuardado }) => {
  const [modalAbierto, setModalAbierto]     = useState(false);
  const [golesLocal, setGolesLocal]         = useState(miPronostico?.prediccion?.golesLocal ?? '');
  const [golesVisitante, setGolesVisitante] = useState(miPronostico?.prediccion?.golesVisitante ?? '');
  const [loading, setLoading]               = useState(false);
  const { success, error }                  = useNotificaciones();

  const estaAbierto   = partido.estaAbierto && partido.estado !== 'finalizado';
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
      {/* Tarjeta oscura — consistente con el fondo de la app */}
      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 hover:border-gray-600 transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-3">

          {/* Equipo local */}
          <div className="flex-1 text-center sm:text-right">
            <p className="font-semibold text-white text-sm sm:text-base">
              {partido.equipoLocal.nombre}
            </p>
            <p className="text-xs text-gray-400">{partido.equipoLocal.codigoPais}</p>
          </div>

          {/* Marcador / hora */}
          <div className="text-center min-w-[90px]">
            {partido.estado === 'finalizado' ? (
              <div className="text-xl sm:text-2xl font-bold text-white">
                {partido.resultado?.golesLocal} — {partido.resultado?.golesVisitante}
              </div>
            ) : (
              <div className="bg-gray-900/60 rounded-lg px-3 py-1.5">
                <p className="text-sm font-semibold text-blue-400">
                  {new Date(partido.fechaHora).toLocaleTimeString('es-AR', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(partido.fechaHora).toLocaleDateString('es-AR', {
                    day: '2-digit', month: '2-digit',
                  })}
                </p>
              </div>
            )}
            {yaPronosticado && partido.estado !== 'finalizado' && (
              <div className="text-xs text-green-400 mt-1 whitespace-nowrap">
                Tu: {miPronostico.prediccion.golesLocal}-{miPronostico.prediccion.golesVisitante}
              </div>
            )}
          </div>

          {/* Equipo visitante */}
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-white text-sm sm:text-base">
              {partido.equipoVisitante.nombre}
            </p>
            <p className="text-xs text-gray-400">{partido.equipoVisitante.codigoPais}</p>
          </div>

          {/* Botón pronosticar */}
          {estaAbierto && (
            <Button
              size="sm"
              variant={yaPronosticado ? 'secondary' : 'primary'}
              onClick={() => setModalAbierto(true)}
              className="shrink-0 w-full sm:w-auto"
            >
              {yaPronosticado ? '✏️ Editar' : '⚽ Pronosticar'}
            </Button>
          )}
        </div>

        {/* Resultado del pronóstico */}
        {partido.estado === 'finalizado' && miPronostico?.puntos !== undefined && (
          <div className="mt-2 text-center text-xs border-t border-gray-700 pt-2">
            {miPronostico.puntos === 3 && <span className="text-green-400">🎯 Exacto +3 pts</span>}
            {miPronostico.puntos === 1 && <span className="text-blue-400">✓ Ganador +1 pt</span>}
            {miPronostico.puntos === 0 && <span className="text-gray-500">✗ Sin puntos</span>}
          </div>
        )}
      </div>

      {/* Modal pronóstico */}
      <Modal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        titulo="Hacé tu pronóstico"
        size="sm"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Input
            label={partido.equipoLocal.nombre}
            type="number"
            min="0"
            max="30"
            value={golesLocal}
            onChange={(e) => setGolesLocal(e.target.value)}
            className="w-full sm:w-28 text-center"
            dark
          />
          <span className="text-2xl font-bold text-gray-400 mt-4 hidden sm:block">—</span>
          <Input
            label={partido.equipoVisitante.nombre}
            type="number"
            min="0"
            max="30"
            value={golesVisitante}
            onChange={(e) => setGolesVisitante(e.target.value)}
            className="w-full sm:w-28 text-center"
            dark
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
          <Button variant="ghost" onClick={() => setModalAbierto(false)} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button onClick={handleGuardar} loading={loading} className="w-full sm:w-auto">
            Guardar pronóstico
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PartidoCard;