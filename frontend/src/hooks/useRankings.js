import { useState, useEffect } from 'react';
import { getRankingGlobal } from '../services/rankingService';

const useRankings = (torneoId) => {
  const [rankings, setRankings] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!torneoId) {
      setCargando(false);
      return;
    }
    
    setCargando(true);
    setError(null);
    
    getRankingGlobal(torneoId)
      .then(({ data }) => {
        console.log('📊 Datos ranking global:', data);
        setRankings(data.data || []);
      })
      .catch((err) => {
        console.error('❌ Error en ranking global:', err);
        setError(err.response?.data?.mensaje || 'Error al cargar ranking');
        setRankings([]);
      })
      .finally(() => setCargando(false));
  }, [torneoId]);

  return { rankings, cargando, error };
};

export default useRankings;