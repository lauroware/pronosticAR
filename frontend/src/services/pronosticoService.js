import api from './api';

export const getMisPronosticos = (torneoId = null) => 
  api.get(`/pronosticos/mis-pronosticos${torneoId ? `?torneoId=${torneoId}` : ''}`);

export const crearPronostico = (data) => api.post('/pronosticos', data);

export const getPronosticosPartido = (partidoId) => 
  api.get(`/pronosticos/partido/${partidoId}`);