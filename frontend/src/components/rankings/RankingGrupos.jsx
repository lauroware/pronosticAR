import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearGrupo } from '../../services/grupoService';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import SubirImagen from '../common/SubirImagen';
import api from '../../services/api';

const CrearGrupo = ({ abierto, onCerrar, onGrupoCreado }) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    limiteMembers: '',
    esPrivado: true,
    imagen: '',
  });
  const [loading, setLoading] = useState(false);
  const [torneoId, setTorneoId] = useState(null);
  const { success, error } = useNotificaciones();
  const navigate = useNavigate();

  useEffect(() => {
    if (abierto && !torneoId) {
      api.get('/torneos/activo')
        .then(({ data }) => setTorneoId(data.data._id))
        .catch(() => error('No se pudo obtener el torneo activo'));
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
        torneoId,
        limiteMembers: form.limiteMembers ? Number(form.limiteMembers) : null,
        esPrivado: form.esPrivado,
        imagen: form.imagen || null,
      };

      const { data: response } = await crearGrupo(data);
      success(`Grupo "${form.nombre}" creado exitosamente`);
      onGrupoCreado?.(response.data);
      setForm({ nombre: '', descripcion: '', limiteMembers: '', esPrivado: true, imagen: '' });
      onCerrar();
      navigate('/grupos');
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al crear el grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo="Crear nuevo grupo" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Foto del grupo */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Foto del grupo <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <div className="flex items-center gap-4">
            {form.imagen ? (
              <img
                src={form.imagen}
                alt="Foto del grupo"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-2xl">
                👥
              </div>
            )}
            <SubirImagen
              label={form.imagen ? 'Cambiar foto' : 'Subir foto'}
              cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}
              uploadPreset={import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}
              onUpload={(url) => setForm({ ...form, imagen: url })}
            />
          </div>
        </div>

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

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.esPrivado}
            onChange={(e) => setForm({ ...form, esPrivado: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">Grupo privado (solo por invitación)</span>
        </label>

        {!torneoId && (
          <div className="bg-yellow-50 rounded-lg p-2 text-center">
            <p className="text-xs text-yellow-600">Cargando torneo activo...</p>
          </div>
        )}

        <div className="flex gap-2 justify-end mt-2">
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