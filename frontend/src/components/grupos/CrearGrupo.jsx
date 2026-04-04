import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearGrupo } from '../../services/grupoService';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import api from '../../services/api';

const CrearGrupo = ({ abierto, onCerrar, onGrupoCreado }) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    limiteMembers: '',
    esPrivado: true
  });
  const [loading, setLoading] = useState(false);
  const [torneoId, setTorneoId] = useState(null);
  const { success, error } = useNotificaciones();
  const navigate = useNavigate();

  // Obtener el torneo activo al cargar el modal
  useEffect(() => {
    if (abierto && !torneoId) {
      api.get('/torneos/activo')
        .then(({ data }) => {
          console.log('🏆 Torneo activo:', data.data);
          setTorneoId(data.data._id);
        })
        .catch((err) => {
          console.error('❌ Error al obtener torneo activo:', err);
          error('No se pudo obtener el torneo activo');
        });
    }
  }, [abierto, torneoId, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return error('El nombre es obligatorio');
    if (!torneoId) return error('Esperando torneo activo...');
    
    setLoading(true);
    try {
      const data = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        torneoId: torneoId,
        limiteMembers: form.limiteMembers ? Number(form.limiteMembers) : null,
        esPrivado: form.esPrivado
      };
      
      console.log('📦 Creando grupo con:', data);
      
      const { data: response } = await crearGrupo(data);
      success(`Grupo "${form.nombre}" creado exitosamente`);
      onGrupoCreado?.(response.data);
      setForm({ nombre: '', descripcion: '', limiteMembers: '', esPrivado: true });
      onCerrar();
      navigate('/grupos');
    } catch (err) {
      console.error('❌ Error detallado:', err.response?.data);
      error(err.response?.data?.mensaje || 'Error al crear el grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo="Crear nuevo grupo" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nombre del grupo *"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          placeholder="Ej: Amigos del Mundial"
          required
        />
        
        <Input
          label="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          placeholder="Descripción opcional"
        />
        
        <Input
          label="Límite de miembros (opcional)"
          type="number"
          min="2"
          max="200"
          value={form.limiteMembers}
          onChange={(e) => setForm({ ...form, limiteMembers: e.target.value })}
          placeholder="Sin límite"
        />
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.esPrivado}
              onChange={(e) => setForm({ ...form, esPrivado: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Grupo privado (solo por invitación)</span>
          </label>
        </div>
        
        {!torneoId && (
          <div className="bg-yellow-50 rounded-lg p-2 text-center">
            <p className="text-xs text-yellow-600">Cargando torneo activo...</p>
          </div>
        )}
        
        <div className="flex gap-2 justify-end mt-4">
          <Button type="button" variant="ghost" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" loading={loading} disabled={!torneoId}>
            Crear grupo
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CrearGrupo;