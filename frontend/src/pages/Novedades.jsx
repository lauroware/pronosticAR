import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useNotificaciones from '../hooks/useNotificaciones';
import api from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const Novedades = () => {
  const { usuario } = useAuth();
  const [novedades, setNovedades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({ titulo: '', contenido: '', imagen: '' });
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotificaciones();

  // Cargar novedades
  const cargarNovedades = async () => {
    try {
      const { data } = await api.get('/novedades');
      setNovedades(data.data || []);
    } catch (err) {
      console.error('Error cargando novedades:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNovedades();
  }, []);

  // Crear novedad (solo admin)
  const handleCrear = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return error('El título es obligatorio');
    
    setLoading(true);
    try {
      await api.post('/novedades', form);
      success('Novedad publicada');
      setModalAbierto(false);
      setForm({ titulo: '', contenido: '', imagen: '' });
      cargarNovedades();
    } catch (err) {
      error(err.response?.data?.mensaje || 'Error al publicar');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar novedad
  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta novedad?')) return;
    try {
      await api.delete(`/novedades/${id}`);
      success('Novedad eliminada');
      cargarNovedades();
    } catch (err) {
      error('Error al eliminar');
    }
  };

  if (cargando) return <div className="text-center py-12">Cargando novedades...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">📰 Novedades</h1>
        {usuario?.rol === 'admin' && (
          <Button onClick={() => setModalAbierto(true)}>+ Publicar novedad</Button>
        )}
      </div>

      {/* Lista de novedades */}
      {novedades.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-400">No hay novedades aún.</p>
          {usuario?.rol === 'admin' && (
            <p className="text-sm text-gray-400 mt-1">Publicá la primera novedad</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {novedades.map((novedad) => (
            <div key={novedad._id} className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{novedad.titulo}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    📅 {new Date(novedad.createdAt).toLocaleDateString('es-AR', { 
                      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                  {novedad.imagen && (
                    <img src={novedad.imagen} alt={novedad.titulo} className="mt-3 rounded-lg max-h-48 object-cover" />
                  )}
                  <p className="text-gray-700 mt-3 whitespace-pre-wrap">{novedad.contenido}</p>
                </div>
                {usuario?.rol === 'admin' && (
                  <button
                    onClick={() => handleEliminar(novedad._id)}
                    className="text-red-500 hover:text-red-700 text-xl leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear novedad */}
      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} titulo="Publicar novedad" size="md">
        <form onSubmit={handleCrear} className="flex flex-col gap-4">
          <Input
            label="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            placeholder="Ej: ¡Comenzó el Mundial 2026!"
            required
          />
          <Input
            label="Contenido"
            value={form.contenido}
            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
            placeholder="Detalles de la novedad..."
            textarea
            rows={4}
          />
          <Input
            label="URL de imagen (opcional)"
            value={form.imagen}
            onChange={(e) => setForm({ ...form, imagen: e.target.value })}
            placeholder="https://..."
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button type="button" variant="ghost" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button type="submit" loading={loading}>Publicar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Novedades;