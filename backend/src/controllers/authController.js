const { Usuario } = require('../models');
const { generarToken } = require('../config/jwt');
const crypto = require('crypto');

// POST /api/auth/registro
const registro = async (req, res, next) => {
  try {
    const { nombre, apellido, username, email, password } = req.body;

    const usuario = await Usuario.create({ nombre, apellido, username, email, password });
    const token   = generarToken(usuario._id);

    res.status(201).json({
      ok: true,
      token,
      usuario: usuario.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({ ok: false, mensaje: 'Email o contraseña incorrectos' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ ok: false, mensaje: 'Cuenta desactivada' });
    }

    const token = generarToken(usuario._id);
    res.json({ ok: true, token, usuario: usuario.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me  (requiere token)
const getMe = async (req, res) => {
  res.json({ ok: true, usuario: req.usuario.toPublicJSON() });
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const usuario = await Usuario.findOne({ email: req.body.email });
    // Siempre responder 200 para no revelar si el email existe
    if (!usuario) {
      return res.json({ ok: true, mensaje: 'Si el email existe, recibirás un enlace' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    usuario.tokenResetPassword = crypto.createHash('sha256').update(token).digest('hex');
    usuario.tokenResetExpira   = Date.now() + 30 * 60 * 1000; // 30 min
    await usuario.save({ validateBeforeSave: false });

    // TODO: enviar email con enlace usando emailService
    // await emailService.enviarResetPassword(usuario.email, token);

    res.json({ ok: true, mensaje: 'Si el email existe, recibirás un enlace', _devToken: process.env.NODE_ENV === 'development' ? token : undefined });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/reset-password/:token
const resetPassword = async (req, res, next) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const usuario   = await Usuario.findOne({
      tokenResetPassword: tokenHash,
      tokenResetExpira:   { $gt: Date.now() },
    });

    if (!usuario) {
      return res.status(400).json({ ok: false, mensaje: 'Token inválido o expirado' });
    }

    usuario.password           = req.body.password;
    usuario.tokenResetPassword = undefined;
    usuario.tokenResetExpira   = undefined;
    await usuario.save();

    const token = generarToken(usuario._id);
    res.json({ ok: true, token, mensaje: 'Contraseña actualizada' });
  } catch (error) {
    next(error);
  }
};

module.exports = { registro, login, getMe, forgotPassword, resetPassword };