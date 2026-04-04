import { useState } from 'react';
import useNotificaciones from '../../hooks/useNotificaciones';

const SubirImagen = ({ onUpload, label, cloudName, uploadPreset }) => {
  const [subiendo, setSubiendo] = useState(false);
  const { error, success } = useNotificaciones();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return error('Solo se permiten imágenes');
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return error('La imagen no puede superar los 5MB');
    }

    setSubiendo(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        success('Imagen subida correctamente');
        onUpload(data.secure_url);
      } else {
        error('Error al subir imagen');
      }
    } catch (err) {
      error('Error de conexión');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
        {label}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={subiendo}
          className="hidden"
        />
      </label>
      {subiendo && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400">Subiendo...</span>
        </div>
      )}
      <button
        onClick={() => document.querySelector(`input[type="file"]`).click()}
        className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors w-fit"
      >
        📁 Seleccionar imagen
      </button>
    </div>
  );
};

export default SubirImagen;