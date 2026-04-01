const { Pronostico, RankingGlobal, RankingGrupos, HistorialRanking, MiembroGrupo, Usuario } = require('../models');

/**
 * Evalúa todos los pronósticos de un partido y actualiza rankings.
 * Se llama cuando el admin carga el resultado final del partido.
 */
const procesarResultadoPartido = async (partido) => {
  const resultado = partido.resultado;

  // 1. Traer todos los pronósticos no evaluados de este partido
  const pronosticos = await Pronostico.find({
    partido: partido._id,
    evaluadoAt: null,
  });

  if (pronosticos.length === 0) return { procesados: 0 };

  // 2. Evaluar cada pronóstico y acumular cambios por usuario
  const bulkPronosticos = [];
  const cambiosPorUsuario = {}; // { userId: { puntos, tipo } }

  for (const p of pronosticos) {
    p.evaluar(resultado);
    bulkPronosticos.push({
      updateOne: {
        filter: { _id: p._id },
        update: { puntos: p.puntos, tipoPremio: p.tipoPremio, evaluadoAt: p.evaluadoAt },
      },
    });

    const uid = p.usuario.toString();
    cambiosPorUsuario[uid] = { puntos: p.puntos, tipo: p.tipoPremio };
  }

  await Pronostico.bulkWrite(bulkPronosticos);

  // 3. Actualizar stats del Usuario y RankingGlobal
  const userIds = Object.keys(cambiosPorUsuario);

  for (const uid of userIds) {
    const { puntos, tipo } = cambiosPorUsuario[uid];

    // Incrementar stats en Usuario
    const incUsuario = { 'stats.totalPronosticos': 1, 'stats.puntajeTotal': puntos };
    if (tipo === 'exacto')  incUsuario['stats.aciertosExactos'] = 1;
    if (tipo === 'ganador') incUsuario['stats.aciertosGanador'] = 1;
    if (tipo === 'fallo')   incUsuario['stats.fallos'] = 1;
    await Usuario.findByIdAndUpdate(uid, { $inc: incUsuario });

    // Actualizar RankingGlobal
    const incRanking = { puntaje: puntos, totalPronosticos: 1 };
    if (tipo === 'exacto')  incRanking['desglose.exactos'] = 1;
    if (tipo === 'ganador') incRanking['desglose.ganadores'] = 1;
    if (tipo === 'fallo')   incRanking['desglose.fallos'] = 1;

    await RankingGlobal.findOneAndUpdate(
      { torneo: partido.torneo, usuario: uid },
      { $inc: incRanking },
      { upsert: true, new: true }
    );

    // Actualizar puntaje en cada grupo donde esté el usuario
    await MiembroGrupo.updateMany(
      { usuario: uid, activo: true },
      { $inc: { puntajeEnGrupo: puntos } }
    );
  }

  // 4. Recalcular posiciones en ranking global
  await recalcularPosicionesGlobal(partido.torneo);

  // 5. Recalcular posiciones en cada grupo afectado
  await recalcularPosicionesGrupos(partido.torneo);

  // 6. Guardar snapshot en historial
  await guardarHistorial(partido, cambiosPorUsuario);

  return { procesados: pronosticos.length };
};

/**
 * Recalcula y persiste las posiciones del ranking global de un torneo.
 */
const recalcularPosicionesGlobal = async (torneoId) => {
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

/**
 * Recalcula posiciones dentro de cada grupo del torneo.
 */
const recalcularPosicionesGrupos = async (torneoId) => {
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

    // Actualizar RankingGrupos (promedio por miembro)
    const puntajeTotal = miembros.reduce((acc, m) => acc + m.puntajeEnGrupo, 0);
    const promedio = miembros.length ? puntajeTotal / miembros.length : 0;

    await RankingGrupos.findOneAndUpdate(
      { torneo: torneoId, grupo: grupo._id },
      { puntajeTotal, promedioPorMiembro: promedio, cantidadMiembros: miembros.length, actualizadoAt: new Date() },
      { upsert: true }
    );
  }

  // Recalcular posiciones entre grupos
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

/**
 * Guarda snapshot del ranking después de cada partido (para gráfico de evolución).
 */
const guardarHistorial = async (partido, cambiosPorUsuario) => {
  const rankings = await RankingGlobal.find({
    torneo: partido.torneo,
    usuario: { $in: Object.keys(cambiosPorUsuario) },
  });

  const docs = rankings.map((r) => ({
    torneo: partido.torneo,
    partido: partido._id,
    usuario: r.usuario,
    posicion: r.posicion,
    puntaje: r.puntaje,
    puntajePartido: cambiosPorUsuario[r.usuario.toString()]?.puntos || 0,
    fechaPartido: partido.fechaHora,
  }));

  if (docs.length) await HistorialRanking.insertMany(docs);
};

module.exports = { procesarResultadoPartido, recalcularPosicionesGlobal, recalcularPosicionesGrupos };