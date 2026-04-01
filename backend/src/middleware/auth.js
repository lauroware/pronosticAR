const { verificarToken } = require('../config/jwt');
const { Usuario } = require('../models');

const proteger = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ ok: false, mensaje: 'No autorizado, token faltante' });
    }

    const decoded = verificarToken(token);
    const usuario = await Usuario.findById(decoded.id).select('-password');

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ ok: false, mensaje: 'Usuario no encontrado o inactivo' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' });
  }
};

module.exports = { proteger };