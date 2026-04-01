const { body, validationResult } = require('express-validator');

const manejarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ ok: false, errores: errores.array() });
  }
  next();
};

const validarRegistro = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('Nombre: entre 2 y 50 caracteres'),
  body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('Apellido: entre 2 y 50 caracteres'),
  body('username').trim().notEmpty().withMessage('El username es obligatorio')
    .isLength({ min: 3, max: 30 }).withMessage('Username: entre 3 y 30 caracteres')
    .matches(/^[a-z0-9_.-]+$/i).withMessage('Username: solo letras, números, guiones y puntos'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  manejarErrores,
];

const validarLogin = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  manejarErrores,
];

const validarResetPassword = [
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  manejarErrores,
];

module.exports = { validarRegistro, validarLogin, validarResetPassword };