const router = require('express').Router();
const { 
  crearGrupo, 
  unirseAGrupo, 
  getMisGrupos, 
  getGrupo, 
  getMiembros,
  actualizarPersonalizacion  // ← Importar la función
} = require('../controllers/grupoController');
const { proteger } = require('../middleware/auth');

router.post('/', proteger, crearGrupo);
router.post('/unirse', proteger, unirseAGrupo);
router.get('/mis-grupos', proteger, getMisGrupos);
router.get('/:id', proteger, getGrupo);
router.get('/:id/miembros', proteger, getMiembros);
router.put('/:id/personalizar', proteger, actualizarPersonalizacion);  // ← Agregar esta línea

module.exports = router;