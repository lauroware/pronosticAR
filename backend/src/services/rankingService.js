const { RankingGlobal, RankingGrupos, MiembroGrupo } = require('../models');

const recalcularGlobal = async (torneoId) => {
  const rankings = await RankingGlobal.find({ torneo: torneoId })
    .sort({ puntaje: -1, 'desglose.exactos': -1 });

  const bulk = rankings.map((r, i) => ({
    updateOne: {
      filter: { _id: r._id },
      update: { posicionAnterior: r.posicion, posicion: i + 1, actualizadoAt: new Date() },
    },
  }));

  if (bulk.length) await RankingGlobal.bulkWrite(bulk);
};

const recalcularGrupos = async (torneoId) => {
  const { Grupo } = require('../models');
  const grupos = await Grupo.find({ torneo: torneoId, activo: true });

  for (const grupo of grupos) {
    const miembros = await MiembroGrupo.find({ grupo: grupo._id, activo: true })
      .sort({ puntajeEnGrupo: -1 });

    const bulk = miembros.map((m, i) => ({
      updateOne: {
        filter: { _id: m._id },
        update: { posicion: i + 1 },
      },
    }));

    if (bulk.length) await MiembroGrupo.bulkWrite(bulk);

    const puntajeTotal = miembros.reduce((acc, m) => acc + m.puntajeEnGrupo, 0);
    const promedio = miembros.length ? puntajeTotal / miembros.length : 0;

    await RankingGrupos.findOneAndUpdate(
      { torneo: torneoId, grupo: grupo._id },
      { puntajeTotal, promedioPorMiembro: promedio, cantidadMiembros: miembros.length, actualizadoAt: new Date() },
      { upsert: true }
    );
  }

  const rankingsGrupos = await RankingGrupos.find({ torneo: torneoId })
    .sort({ promedioPorMiembro: -1 });

  const bulk = rankingsGrupos.map((r, i) => ({
    updateOne: {
      filter: { _id: r._id },
      update: { posicionAnterior: r.posicion, posicion: i + 1 },
    },
  }));

  if (bulk.length) await RankingGrupos.bulkWrite(bulk);
};

module.exports = { recalcularGlobal, recalcularGrupos };