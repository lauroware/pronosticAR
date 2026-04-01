const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ ok: false, mensaje: 'Acceso denegado: se requiere rol admin' });
  }
  next();
};

module.exports = { soloAdmin };