const { Usuario } = require('../models');

// GET /api/usuarios/perfil/:username
const getPerfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findOne({ username: req.params.username });
    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    res.json({ ok: true, data: usuario.toPublicJSON() });
  } catch (error) { next(error); }
};

// PUT /api/usuarios/perfil  (el propio usuario edita su perfil)
const actualizarPerfil = async (req, res, next) => {
  try {
    const campos = ['nombre', 'apellido', 'avatar'];
    campos.forEach((c) => { if (req.body[c] !== undefined) req.usuario[c] = req.body[c]; });
    await req.usuario.save();
    res.json({ ok: true, usuario: req.usuario.toPublicJSON() });
  } catch (error) { next(error); }
};

// PUT /api/usuarios/cambiar-password
const cambiarPassword = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id).select('+password');
    if (!(await usuario.compararPassword(req.body.passwordActual))) {
      return res.status(400).json({ ok: false, mensaje: 'Contraseña actual incorrecta' });
    }
    usuario.password = req.body.passwordNueva;
    await usuario.save();
    res.json({ ok: true, mensaje: 'Contraseña actualizada' });
  } catch (error) { next(error); }
};

module.exports = { getPerfil, actualizarPerfil, cambiarPassword };