const router = require('express').Router();
const { getNovedades, crearNovedad, eliminarNovedad } = require('../controllers/novedadController');
const { proteger } = require('../middleware/auth');
const { soloAdmin } = require('../middleware/admin');

router.get('/', proteger, getNovedades);
router.post('/', proteger, soloAdmin, crearNovedad);
router.delete('/:id', proteger, soloAdmin, eliminarNovedad);

module.exports = router;