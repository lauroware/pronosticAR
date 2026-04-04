const { body } = require('express-validator');
const { manejarErrores } = require('../middleware/validation');
const validarPronostico = [
  body('partidoId').notEmpty().withMessage('partidoId es requerido'),
  body('golesLocal').isInt({ min: 0, max: 30 }).withMessage('Goles local inválidos'),
  body('golesVisitante').isInt({ min: 0, max: 30 }).withMessage('Goles visitante inválidos'),
  manejarErrores,
];
module.exports = { validarPronostico };