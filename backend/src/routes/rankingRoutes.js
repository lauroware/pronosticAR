const router = require('express').Router();
const { getRankingGlobal, getRankingGrupo, getRankingEntreGrupos, getEvolucion, getMiPosicion } = require('../controllers/rankingController');
const { proteger } = require('../middleware/auth');

router.get('/global',                   proteger, getRankingGlobal);
router.get('/grupo/:grupoId',           proteger, getRankingGrupo);
router.get('/grupos',                   proteger, getRankingEntreGrupos);
router.get('/evolucion/:usuarioId',     proteger, getEvolucion);
router.get('/mi-posicion',              proteger, getMiPosicion);

module.exports = router;