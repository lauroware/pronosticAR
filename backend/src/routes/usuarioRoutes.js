const router = require('express').Router();
const { getPerfil, actualizarPerfil, cambiarPassword } = require('../controllers/usuarioController');
const { proteger } = require('../middleware/auth');

router.get('/perfil/:username',   getPerfil);
router.put('/perfil',             proteger, actualizarPerfil);
router.put('/cambiar-password',   proteger, cambiarPassword);

module.exports = router;