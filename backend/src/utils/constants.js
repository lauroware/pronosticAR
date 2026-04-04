export const PUNTOS = { EXACTO: 3, GANADOR: 1, FALLO: 0 };

export const FASES = [
  { valor: 'grupos',       label: 'Fase de grupos' },
  { valor: 'octavos',      label: 'Octavos de final' },
  { valor: 'cuartos',      label: 'Cuartos de final' },
  { valor: 'semifinal',    label: 'Semifinales' },
  { valor: 'tercer_puesto', label: 'Tercer puesto' },
  { valor: 'final',        label: 'Final' },
];

export const ESTADOS_PARTIDO = [
  { valor: 'programado',  label: 'Programado' },
  { valor: 'en_curso',    label: 'En curso' },
  { valor: 'finalizado',  label: 'Finalizado' },
];

export const GRUPOS_MUNDIAL = ['A','B','C','D','E','F'];

export const TORNEO_ID = import.meta.env.VITE_TORNEO_ID || '';