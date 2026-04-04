import api from './api';

export const getPartidos = (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  return api.get(`/partidos${params ? `?${params}` : ''}`);
};

export const getPartido = (id) => api.get(`/partidos/${id}`);

export const cargarResultado = (id, resultado) => 
  api.put(`/partidos/${id}/resultado`, resultado);