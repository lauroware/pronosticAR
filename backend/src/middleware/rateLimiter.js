const rateLimit = require('express-rate-limit');

const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { ok: false, mensaje: 'Demasiados intentos, esperá 15 minutos' },
});

const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { ok: false, mensaje: 'Demasiadas peticiones' },
});

module.exports = { limiterAuth, limiterGeneral };