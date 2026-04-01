const router = require('express').Router();
const { getPartidos, getPartido, crearPartido, actualizarPartido, cargarResultado } = require('../controllers/partidoController');
const { proteger } = require('../middleware/auth');
const { soloAdmin } = require('../middleware/admin');

router.get('/',                         proteger, getPartidos);
router.get('/:id',                      proteger, getPartido);
router.post('/',                        proteger, soloAdmin, crearPartido);
router.put('/:id',                      proteger, soloAdmin, actualizarPartido);
router.put('/:id/resultado',            proteger, soloAdmin, cargarResultado);

module.exports = router;