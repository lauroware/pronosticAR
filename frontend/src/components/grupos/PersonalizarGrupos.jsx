import { useState } from 'react';
import { actualizarGrupo } from '../../services/grupoService';
import useNotificaciones from '../../hooks/useNotificaciones';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import SubirImagen from '../common/SubirImagen';

const PersonalizarGrupo = ({ grupo, abierto, onCerrar, onActualizado }) => {
  const [form, setForm] = useState({
    imagenPortada: grupo?.imagenPortada || '',
    avatar: grupo?.avatar || '',
    colorPrimario: grupo?.colorPrimario || '#3b82f6',
    colorSecundario: grupo?.colorSecundario || '#1e40af',
    reglas: grupo?.reglas || '',
    bienvenida: grupo?.bienvenida || '¡Bienvenidos al grupo!'
  });
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotificaciones();

  const coloresPredefinidos = [
    '#3b82f6', // Azul
    '#ef4444', // Rojo
    '#22c55e', // Verde
    '#eab308', // Amarillo
    '#a855f7', // Violeta
    '#ec4899', // Rosa
    '#f97316', // Naranja
    '#06b6d4', // Cyan
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await actualizarGrupo(grupo._id, form);
      success('Grupo personalizado');
      onActualizado?.();
      onCerrar();
    } catch (err) {
      error('Error al personalizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo="🎨 Personalizar grupo" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto px-1">
        
        {/* Vista previa */}
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-400 mb-2">Vista previa</p>
          <div 
            className="rounded-xl p-4"
            style={{ backgroundColor: form.colorPrimario + '20', border: `1px solid ${form.colorPrimario}` }}
          >
            <div className="flex items-center gap-3">
              {form.avatar ? (
                <img src={form.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl">
                  👥
                </div>
              )}
              <div>
                <h3 className="font-bold text-white" style={{ color: form.colorPrimario }}>{grupo?.nombre}</h3>
                <p className="text-xs text-gray-400">{form.bienvenida}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subir avatar del grupo */}
        <div>
          <label className="text-sm text-gray-400 block mb-2">Avatar del grupo</label>
          <div className="flex items-center gap-4">
            {form.avatar ? (
              <img src={form.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-gray-600" />
            ) : (
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                👥
              </div>
            )}
            <SubirImagen
              label="Subir avatar"
              cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}
              uploadPreset={import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}
              onUpload={(url) => setForm({ ...form, avatar: url })}
            />
          </div>
        </div>

        {/* Subir imagen de portada */}
        <div>
          <label className="text-sm text-gray-400 block mb-2">Imagen de portada (banner)</label>
          {form.imagenPortada && (
            <img src={form.imagenPortada} alt="Portada" className="w-full h-32 object-cover rounded-lg mb-2" />
          )}
          <SubirImagen
            label={form.imagenPortada ? "Cambiar portada" : "Subir portada"}
            cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}
            uploadPreset={import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}
            onUpload={(url) => setForm({ ...form, imagenPortada: url })}
          />
        </div>

        {/* Selector de color principal */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Color principal del grupo</label>
          <div className="flex gap-2 flex-wrap">
            {coloresPredefinidos.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, colorPrimario: color })}
                className={`w-8 h-8 rounded-full transition-all ${
                  form.colorPrimario === color ? 'ring-2 ring-white scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <Input
          label="Mensaje de bienvenida"
          value={form.bienvenida}
          onChange={(e) => setForm({ ...form, bienvenida: e.target.value })}
          placeholder="¡Bienvenidos al grupo!"
        />

        {/* Reglas del grupo */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Reglas del grupo</label>
          <textarea
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={form.reglas}
            onChange={(e) => setForm({ ...form, reglas: e.target.value })}
            placeholder="1. Respetar a los demás&#10;2. Hacer los pronósticos antes del partido&#10;3. El que no pronostica pierde el partido"
          />
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button type="button" variant="ghost" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" loading={loading}>Guardar cambios</Button>
        </div>
      </form>
    </Modal>
  );
};

export default PersonalizarGrupo;