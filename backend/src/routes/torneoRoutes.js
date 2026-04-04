const router = require('express').Router();
const { getTorneos, getTorneoActivo, getTorneo, crearTorneo, actualizarTorneo } = require('../controllers/torneoController');
const { proteger } = require('../middleware/auth');
const { soloAdmin } = require('../middleware/admin');

router.get('/',         proteger, getTorneos);
router.get('/activo',   proteger, getTorneoActivo);
router.get('/:id',      proteger, getTorneo);
router.post('/',        proteger, soloAdmin, crearTorneo);
router.put('/:id',      proteger, soloAdmin, actualizarTorneo);
module.exports = router;