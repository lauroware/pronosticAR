const router = require('express').Router();
const { crearOActualizar, getMisPronosticos, getPronosticosPartido } = require('../controllers/pronosticoController');
const { proteger } = require('../middleware/auth');

router.post('/',                        proteger, crearOActualizar);
router.get('/mis-pronosticos',          proteger, getMisPronosticos);
router.get('/partido/:partidoId',       proteger, getPronosticosPartido);

module.exports = router;