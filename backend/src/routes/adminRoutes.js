const router = require('express').Router();
router.get('/', (req, res) => res.json({ ok: true, mensaje: 'adminRoutes OK' }));
module.exports = router;
