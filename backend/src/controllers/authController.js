const { Usuario } = require('../models');
const { generarToken } = require('../config/jwt');
const crypto = require('crypto');

const PUNTOS_PUESTO = 7; // puntos por cada puesto acertado

// POST /api/auth/registro
const registro = async (req, res, next) => {
  try {
    const { nombre, apellido, username, email, password, pronosticoFinal } = req.body;

    const datosUsuario = { nombre, apellido, username, email, password };

    // Si viene el pronóstico final completo, lo guardamos bloqueado desde el inicio
    if (
      pronosticoFinal?.campeon &&
      pronosticoFinal?.segundo &&
      pronosticoFinal?.tercero &&
      pronosticoFinal?.cuarto
    ) {
      datosUsuario.pronosticoFinal = {
        campeon:  pronosticoFinal.campeon.toUpperCase(),
        segundo:  pronosticoFinal.segundo.toUpperCase(),
        tercero:  pronosticoFinal.tercero.toUpperCase(),
        cuarto:   pronosticoFinal.cuarto.toUpperCase(),
        bloqueado: true,
        puntosObtenidos: 0,
      };
    }

    const usuario = await Usuario.create(datosUsuario);
    const token   = generarToken(usuario._id);

    res.status(201).json({ ok: true, token, usuario: usuario.toPublicJSON() });
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

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ ok: true, usuario: req.usuario.toPublicJSON() });
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const usuario = await Usuario.findOne({ email: req.body.email });
    if (!usuario) return res.json({ ok: true, mensaje: 'Si el email existe, recibirás un enlace' });

    const token = crypto.randomBytes(32).toString('hex');
    usuario.tokenResetPassword = crypto.createHash('sha256').update(token).digest('hex');
    usuario.tokenResetExpira   = Date.now() + 30 * 60 * 1000;
    await usuario.save({ validateBeforeSave: false });

    res.json({
      ok: true,
      mensaje: 'Si el email existe, recibirás un enlace',
      _devToken: process.env.NODE_ENV === 'development' ? token : undefined,
    });
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
    if (!usuario) return res.status(400).json({ ok: false, mensaje: 'Token inválido o expirado' });

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

// PUT /api/auth/evaluar-pronostico-final  (solo admin)
// Se llama cuando el torneo termina para otorgar los 7 puntos por puesto acertado
const evaluarPronosticoFinal = async (req, res, next) => {
  try {
    // { campeon, segundo, tercero, cuarto } — códigos FIFA reales del torneo
    const { campeon, segundo, tercero, cuarto } = req.body;
    if (!campeon || !segundo || !tercero || !cuarto) {
      return res.status(400).json({ ok: false, mensaje: 'Faltan los 4 puestos del torneo' });
    }

    const resultado = {
      campeon:  campeon.toUpperCase(),
      segundo:  segundo.toUpperCase(),
      tercero:  tercero.toUpperCase(),
      cuarto:   cuarto.toUpperCase(),
    };

    // Traer todos los usuarios que tienen pronóstico final
    const usuarios = await Usuario.find({ 'pronosticoFinal.bloqueado': true });
    let actualizados = 0;

    for (const u of usuarios) {
      const pf = u.pronosticoFinal;
      let puntos = 0;
      if (pf.campeon === resultado.campeon) puntos += PUNTOS_PUESTO;
      if (pf.segundo === resultado.segundo) puntos += PUNTOS_PUESTO;
      if (pf.tercero === resultado.tercero) puntos += PUNTOS_PUESTO;
      if (pf.cuarto  === resultado.cuarto)  puntos += PUNTOS_PUESTO;

      if (puntos > 0) {
        await Usuario.findByIdAndUpdate(u._id, {
          $set:  { 'pronosticoFinal.puntosObtenidos': puntos },
          $inc:  { 'stats.puntajeTotal': puntos },
        });
        actualizados++;
      }
    }

    res.json({ ok: true, mensaje: `Pronósticos finales evaluados. ${actualizados} usuarios con puntos.` });
  } catch (error) {
    next(error);
  }
};

module.exports = { registro, login, getMe, forgotPassword, resetPassword, evaluarPronosticoFinal };