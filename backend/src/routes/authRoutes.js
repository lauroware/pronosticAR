const router  = require('express').Router();
const { registro, login, getMe, forgotPassword, resetPassword, evaluarPronosticoFinal } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');
const { soloAdmin } = require('../middleware/admin');
const { limiterAuth } = require('../middleware/rateLimiter');
const { validarRegistro, validarLogin, validarResetPassword } = require('../validators/authValidator');

router.post('/registro',               limiterAuth, validarRegistro, registro);
router.post('/login',                  limiterAuth, validarLogin, login);
router.get('/me',                      proteger, getMe);
router.post('/forgot-password',        limiterAuth, forgotPassword);
router.put('/reset-password/:token',   validarResetPassword, resetPassword);

// Solo admin — evalúa los pronósticos finales al terminar el torneo
router.post('/evaluar-pronostico-final', proteger, soloAdmin, evaluarPronosticoFinal);

module.exports = router;