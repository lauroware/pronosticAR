import { useState, useEffect } from 'react';
import api from '../services/api';

const usePartidos = (filtros = {}) => {
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPartidos = async () => {
      setCargando(true);
      try {
        // Construir query params correctamente
        const params = new URLSearchParams();
        
        if (filtros.estado && filtros.estado !== '') {
          params.append('estado', filtros.estado);
        }
        if (filtros.grupoFase) {
          params.append('grupoFase', filtros.grupoFase);
        }
        if (filtros.limit) {
          params.append('limit', filtros.limit);
        }
        
        const url = `/partidos${params.toString() ? `?${params.toString()}` : ''}`;
        console.log('🔍 URL del backend:', url); // Para ver qué está pidiendo
        
        const { data } = await api.get(url);
        console.log('📊 Partidos recibidos:', data.data?.length || 0);
        
        setPartidos(data.data || []);
      } catch (error) {
        console.error('❌ Error cargando partidos:', error);
        setPartidos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarPartidos();
  }, [filtros.estado, filtros.grupoFase, filtros.limit]);

  return { partidos, setPartidos, cargando };
};

export default usePartidos;