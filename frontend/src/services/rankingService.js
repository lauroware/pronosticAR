import api from './api';

export const getRankingGlobal = (torneoId, page = 1) => 
  api.get(`/rankings/global?torneoId=${torneoId}&page=${page}`);

export const getRankingGrupo = (grupoId) => 
  api.get(`/rankings/grupo/${grupoId}`);

export const getRankingEntreGrupos = (torneoId) => 
  api.get(`/rankings/grupos?torneoId=${torneoId}`);

export const getEvolucion = (usuarioId, torneoId, grupoId = null) => {
  let url = `/rankings/evolucion/${usuarioId}?torneoId=${torneoId}`;
  if (grupoId) url += `&grupoId=${grupoId}`;
  return api.get(url);
};

export const getMiPosicion = (torneoId) => 
  api.get(`/rankings/mi-posicion?torneoId=${torneoId}`);