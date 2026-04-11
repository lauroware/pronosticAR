const router  = require('express').Router();
const crypto = require('crypto');
const User = require('../models/User'); // Ajusta la ruta según tu estructura
const sendPasswordResetEmail = require('../services/emailService'); // Ajusta la ruta
const { registro, login, getMe, forgotPassword, resetPassword, evaluarPronosticoFinal } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');
const { soloAdmin } = require('../middleware/admin');
const { limiterAuth } = require('../middleware/rateLimiter');
const { validarRegistro, validarLogin, validarResetPassword } = require('../validators/authValidator');

router.post('/registro',               limiterAuth, validarRegistro, registro);
router.post('/login',                  limiterAuth, validarLogin, login);
router.get('/me',                      proteger, getMe);
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log(`[1/6] Solicitud recibida para email: ${email}`);

    try {
        const user = await User.findOne({ email });
        console.log(`[2/6] Búsqueda completada. Usuario encontrado: ${!!user}`);

        if (!user) {
            console.log(`[3/6] Usuario no existe, respondiendo 200 genérico`);
            return res.status(200).json({ message: 'Si el correo existe, recibirás un enlace' });
        }

        // Generar token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });
        console.log(`[4/6] Token generado y guardado para ${user.email}`);

        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        console.log(`[5/6] URL de restablecimiento: ${resetUrl}`);

        // Enviar email
        console.log(`[6/6] Intentando enviar email a ${user.email}...`);
        await sendPasswordResetEmail(user.email, resetUrl);
        console.log(`✅ Email enviado exitosamente a ${user.email}`);

        res.status(200).json({ message: 'Si el correo existe, recibirás un enlace' });
    } catch (error) {
        console.error('❌ ERROR en forgot-password:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

router.put('/reset-password/:token',   validarResetPassword, resetPassword);

// Solo admin — evalúa los pronósticos finales al terminar el torneo
router.post('/evaluar-pronostico-final', proteger, soloAdmin, evaluarPronosticoFinal);

module.exports = router;