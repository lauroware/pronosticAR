const router = require('express').Router();
const { crearPreferencia, webhook, estadoPago } = require('../controllers/pagoController');
const { proteger } = require('../middleware/auth');

// El webhook NO lleva autenticación — lo llama MercadoPago directamente
router.post('/webhook', webhook);

// Estos sí requieren usuario logueado
router.post('/crear-preferencia', proteger, crearPreferencia);
router.get('/estado/:grupoId',    proteger, estadoPago);

module.exports = router;