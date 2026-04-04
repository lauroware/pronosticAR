const { body } = require('express-validator');
const { manejarErrores } = require('../middleware/validation');
const validarCrearGrupo = [
  body('nombre').trim().notEmpty().isLength({ min: 3, max: 60 }).withMessage('Nombre: 3-60 caracteres'),
  manejarErrores,
];
module.exports = { validarCrearGrupo };