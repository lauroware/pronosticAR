import { useState } from 'react';
import { crearPronostico } from '../../services/pronosticoService';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { getBandera } from '../../utils/banderas';

const PartidoCard = ({ partido, miPronostico, onPronosticoGuardado }) => {
  const [modalAbierto, setModalAbierto]     = useState(false);
  const [golesLocal, setGolesLocal]         = useState(miPronostico?.prediccion?.golesLocal ?? '');
  const [golesVisitante, setGolesVisitante] = useState(miPronostico?.prediccion?.golesVisitante ?? '');
  const [loading, setLoading]               = useState(false);
  const { success, error }                  = useNotificaciones();

  const estaAbierto    = partido.estaAbierto && partido.estado !== 'finalizado';
  const yaPronosticado = !!miPronostico?.prediccion;

  const flagLocal      = getBandera(partido.equipoLocal.codigoPais);
  const flagVisitante  = getBandera(partido.equipoVisitante.codigoPais);

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
      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 hover:border-gray-600 transition-colors">
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Equipo local */}
          <div className="flex-1 flex flex-col items-center sm:items-end gap-0.5">
            <span className="text-2xl sm:text-3xl leading-none">{flagLocal}</span>
            <p className="font-semibold text-white text-xs sm:text-sm text-center sm:text-right leading-tight">
              {partido.equipoLocal.nombre}
            </p>
          </div>

          {/* Centro: marcador / hora + pronóstico */}
          <div className="flex flex-col items-center min-w-[80px] sm:min-w-[96px] gap-1">
            {partido.estado === 'finalizado' ? (
              <div className="text-xl sm:text-2xl font-bold text-white tracking-widest">
                {partido.resultado?.golesLocal} — {partido.resultado?.golesVisitante}
              </div>
            ) : (
              <div className="bg-gray-900/70 rounded-lg px-3 py-1.5 text-center">
                <p className="text-sm font-bold text-blue-400 leading-none">
                  {new Date(partido.fechaHora).toLocaleTimeString('es-AR', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(partido.fechaHora).toLocaleDateString('es-AR', {
                    day: '2-digit', month: '2-digit',
                  })}
                </p>
              </div>
            )}
            {yaPronosticado && partido.estado !== 'finalizado' && (
              <span className="text-xs text-green-400 whitespace-nowrap">
                ✓ {miPronostico.prediccion.golesLocal}-{miPronostico.prediccion.golesVisitante}
              </span>
            )}
          </div>

          {/* Equipo visitante */}
          <div className="flex-1 flex flex-col items-center sm:items-start gap-0.5">
            <span className="text-2xl sm:text-3xl leading-none">{flagVisitante}</span>
            <p className="font-semibold text-white text-xs sm:text-sm text-center sm:text-left leading-tight">
              {partido.equipoVisitante.nombre}
            </p>
          </div>

          {/* Botón */}
          {estaAbierto && (
            <Button
              size="sm"
              variant={yaPronosticado ? 'secondary' : 'primary'}
              onClick={() => setModalAbierto(true)}
              className="shrink-0 hidden sm:block"
            >
              {yaPronosticado ? '✏️ Editar' : 'Pronosticar'}
            </Button>
          )}
        </div>

        {/* Botón mobile — ancho completo */}
        {estaAbierto && (
          <div className="mt-3 sm:hidden">
            <Button
              size="sm"
              variant={yaPronosticado ? 'secondary' : 'primary'}
              onClick={() => setModalAbierto(true)}
              className="w-full"
            >
              {yaPronosticado ? '✏️ Editar pronóstico' : '⚽ Pronosticar'}
            </Button>
          </div>
        )}

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
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="text-center">
            <div className="text-4xl mb-1">{flagLocal}</div>
            <p className="text-xs text-gray-400 max-w-[80px] leading-tight">{partido.equipoLocal.nombre}</p>
          </div>
          <span className="text-gray-600 text-xl font-bold">vs</span>
          <div className="text-center">
            <div className="text-4xl mb-1">{flagVisitante}</div>
            <p className="text-xs text-gray-400 max-w-[80px] leading-tight">{partido.equipoVisitante.nombre}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center">
          <Input
            type="number"
            min="0"
            max="30"
            value={golesLocal}
            onChange={(e) => setGolesLocal(e.target.value)}
            className="w-24 text-center"
            dark
          />
          <span className="text-2xl font-bold text-gray-500">—</span>
          <Input
            type="number"
            min="0"
            max="30"
            value={golesVisitante}
            onChange={(e) => setGolesVisitante(e.target.value)}
            className="w-24 text-center"
            dark
          />
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <Button variant="ghost" onClick={() => setModalAbierto(false)}>Cancelar</Button>
          <Button onClick={handleGuardar} loading={loading}>Guardar pronóstico</Button>
        </div>
      </Modal>
    </>
  );
};

export default PartidoCard;