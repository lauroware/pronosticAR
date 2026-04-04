import api from './api';

export const getGrupos = () => api.get('/grupos/mis-grupos');

export const getGrupo = (id) => api.get(`/grupos/${id}`);

export const getMiembros = (id) => api.get(`/grupos/${id}/miembros`);

export const crearGrupo = (data) => api.post('/grupos', data);

export const unirseAGrupo = (codigo) => api.post('/grupos/unirse', { codigo });

export const salirDelGrupo = (id) => api.put(`/grupos/${id}/salir`);

export const eliminarGrupo = (id) => api.delete(`/grupos/${id}`);

export const actualizarGrupo = (id, data) => api.put(`/grupos/${id}/personalizar`, data);