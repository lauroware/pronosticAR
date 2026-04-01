const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ ok: false, mensaje: mensajes.join(', ') });
  }

  // Clave duplicada (email/username ya existe)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(400).json({ ok: false, mensaje: `El ${campo} ya está en uso` });
  }

  // CastError (ObjectId inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({ ok: false, mensaje: 'ID inválido' });
  }

  res.status(err.statusCode || 500).json({
    ok: false,
    mensaje: err.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;