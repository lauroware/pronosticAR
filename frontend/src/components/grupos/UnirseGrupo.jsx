import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { unirseAGrupo } from '../../services/grupoService';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import UpgradeModal from './UpgradeModal';

const UnirseGrupo = ({ abierto, onCerrar, onUnido }) => {
  const [codigo, setCodigo]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [upgradeInfo, setUpgradeInfo] = useState(null); // { grupoId, grupoNombre }
  const { success, error }            = useNotificaciones();
  const navigate                      = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) return error('Ingresá el código de invitación');

    setLoading(true);
    try {
      const { data } = await unirseAGrupo(codigo.toUpperCase());
      success(`Te uniste al grupo "${data.data.nombre}"`);
      onUnido?.(data.data);
      setCodigo('');
      onCerrar();
      navigate(`/grupos/${data.data._id}`);
    } catch (err) {
      const resp = err.response?.data;

      // El grupo está lleno — mostramos el UpgradeModal en lugar de un error genérico
      if (resp?.codigo === 'LIMITE_ALCANZADO') {
        onCerrar(); // cerramos el modal de "unirse"
        setUpgradeInfo({ grupoId: resp.grupoId, grupoNombre: resp.grupoNombre });
      } else {
        error(resp?.mensaje || 'Código inválido o grupo lleno');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal abierto={abierto} onCerrar={onCerrar} titulo="Unirse a un grupo" size="sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Código de invitación"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ej: A3F7C9D2"
            required
          />

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-400 text-center">
              💡 Pedile el código a un amigo que ya esté en el grupo
            </p>
          </div>

          {/* Nota sobre el plan gratuito — discreta */}
          <p className="text-xs text-gray-500 text-center">
           
          </p>

          <div className="flex gap-2 justify-end mt-2">
            <Button type="button" variant="ghost" onClick={onCerrar}>Cancelar</Button>
            <Button type="submit" loading={loading}>Unirse al grupo</Button>
          </div>
        </form>
      </Modal>

      {/* Aparece solo si el grupo estaba lleno */}
      <UpgradeModal
        abierto={!!upgradeInfo}
        onCerrar={() => setUpgradeInfo(null)}
        grupoId={upgradeInfo?.grupoId}
        grupoNombre={upgradeInfo?.grupoNombre}
        esAdmin={false} // quien intenta unirse nunca es admin
      />
    </>
  );
};

export default UnirseGrupo;