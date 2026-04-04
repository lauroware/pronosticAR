const router = require('express').Router();

router.use('/auth',        require('./authRoutes'));
router.use('/usuarios',    require('./usuarioRoutes'));
router.use('/torneos',     require('./torneoRoutes'));
router.use('/partidos',    require('./partidoRoutes'));
router.use('/pronosticos', require('./pronosticoRoutes'));
router.use('/grupos',      require('./grupoRoutes'));
router.use('/rankings',    require('./rankingRoutes'));
router.use('/admin',       require('./adminRoutes'));
router.use('/novedades', require('./novedadRoutes'));

module.exports = router;