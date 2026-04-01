const router = require('express').Router();
const { crearGrupo, unirseAGrupo, getMisGrupos, getGrupo, getMiembros } = require('../controllers/grupoController');
const { proteger } = require('../middleware/auth');

router.post('/',                        proteger, crearGrupo);
router.post('/unirse',                  proteger, unirseAGrupo);
router.get('/mis-grupos',               proteger, getMisGrupos);
router.get('/:id',                      proteger, getGrupo);
router.get('/:id/miembros',             proteger, getMiembros);

module.exports = router;