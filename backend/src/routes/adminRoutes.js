const router = require('express').Router();
const { getStats, getUsuarios, toggleUsuario, cambiarRol } = require('../controllers/adminController');
const { proteger } = require('../middleware/auth');
const { soloAdmin } = require('../middleware/admin');

router.use(proteger, soloAdmin);
router.get('/stats',                  getStats);
router.get('/usuarios',               getUsuarios);
router.put('/usuarios/:id/toggle',    toggleUsuario);
router.put('/usuarios/:id/rol',       cambiarRol);
module.exports = router;