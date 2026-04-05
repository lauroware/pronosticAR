const router = require('express').Router();
const {
  getStats, getUsuarios, toggleUsuario, eliminarUsuario, cambiarRol, getPartidosAdmin,
} = require('../controllers/adminController');
const { proteger }  = require('../middleware/auth');
const { soloAdmin } = require('../middleware/admin');

router.use(proteger, soloAdmin);

router.get('/stats',                    getStats);
router.get('/usuarios',                 getUsuarios);
router.put('/usuarios/:id/toggle',      toggleUsuario);
router.delete('/usuarios/:id',          eliminarUsuario);
router.put('/usuarios/:id/rol',         cambiarRol);
router.get('/partidos',                 getPartidosAdmin);

module.exports = router;