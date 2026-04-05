const router = require('express').Router();
const {
  getRankingGlobal, getRankingGrupo, getRankingEntreGrupos,
  getEvolucion, getMiPosicion, getStatsPronosticoFinal,
} = require('../controllers/rankingController');
const { proteger } = require('../middleware/auth');

router.get('/global',                    proteger, getRankingGlobal);
router.get('/grupo/:grupoId',            proteger, getRankingGrupo);
router.get('/grupos',                    proteger, getRankingEntreGrupos);
router.get('/evolucion/:usuarioId',      proteger, getEvolucion);
router.get('/mi-posicion',              proteger, getMiPosicion);
router.get('/stats-pronostico-final',   proteger, getStatsPronosticoFinal);

module.exports = router;