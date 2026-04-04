import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { unirseAGrupo } from '../../services/grupoService';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const UnirseGrupo = ({ abierto, onCerrar, onUnido }) => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotificaciones();
  const navigate = useNavigate();

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
      error(err.response?.data?.mensaje || 'Código inválido o grupo lleno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo="Unirse a un grupo" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Código de invitación"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          placeholder="Ej: A3F7C9D2"
          required
        />
        
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-700 text-center">
            💡 Pedile el código a un amigo que ya esté en el grupo
          </p>
        </div>
        
        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="ghost" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" loading={loading}>Unirse al grupo</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UnirseGrupo;