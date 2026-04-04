const cron = require('node-cron');
const { Torneo } = require('../models');
const { recalcularGlobal, recalcularGrupos } = require('../services/rankingService');

// Recalcula rankings cada 30 minutos
const iniciar = () => {
  cron.schedule('*/30 * * * *', async () => {
    try {
      const torneo = await Torneo.findOne({ activo: true });
      if (!torneo) return;
      await recalcularGlobal(torneo._id);
      await recalcularGrupos(torneo._id);
      console.log('[CRON] Rankings actualizados');
    } catch (e) {
      console.error('[CRON] Error actualizando rankings:', e.message);
    }
  });
  console.log('[CRON] Job actualizarRankings iniciado');
};
module.exports = { iniciar };