const { Partido, Torneo, Pronostico } = require('../models');
const { procesarResultadoPartido } = require('../services/puntuacionService');

// GET /api/partidos?torneo=id&fase=grupos&estado=programado
const getPartidos = async (req, res, next) => {
  try {
    const { torneo, fase, estado, grupoFase, page = 1, limit = 20 } = req.query;
    const filtro = {};

    if (torneo)     filtro.torneo    = torneo;
    if (fase)       filtro.fase      = fase;
    if (estado)     filtro.estado    = estado;
    if (grupoFase)  filtro.grupoFase = grupoFase;

    const [partidos, total] = await Promise.all([
      Partido.find(filtro)
        .sort({ fechaHora: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Partido.countDocuments(filtro),
    ]);

    res.json({ ok: true, data: partidos, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (error) {
    next(error);
  }
};

// GET /api/partidos/:id
const getPartido = async (req, res, next) => {
  try {
    const partido = await Partido.findById(req.params.id).populate('torneo', 'nombre edicion');
    if (!partido) return res.status(404).json({ ok: false, mensaje: 'Partido no encontrado' });
    res.json({ ok: true, data: partido });
  } catch (error) {
    next(error);
  }
};

// POST /api/partidos  (solo admin)
const crearPartido = async (req, res, next) => {
  try {
    const partido = await Partido.create(req.body);
    await Torneo.findByIdAndUpdate(partido.torneo, { $inc: { totalPartidos: 1 } });
    res.status(201).json({ ok: true, data: partido });
  } catch (error) {
    next(error);
  }
};

// PUT /api/partidos/:id  (solo admin)
// ⛔ Bloquea la edición si el partido ya comenzó o finalizó
const actualizarPartido = async (req, res, next) => {
  try {
    const partido = await Partido.findById(req.params.id);
    if (!partido) {
      return res.status(404).json({ ok: false, mensaje: 'Partido no encontrado' });
    }

    // Bloquear si el estado ya no es "programado"
    if (partido.estado !== 'programado') {
      return res.status(400).json({
        ok: false,
        mensaje: `No se puede editar un partido en estado "${partido.estado}". Solo se pueden editar partidos programados.`,
      });
    }

    // Bloquear si la fecha de inicio ya pasó (el partido ya debería haber arrancado)
    const ahora = new Date();
    const cierreEfectivo = partido.cierrePronóstico || partido.fechaHora;
    if (ahora >= cierreEfectivo) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se puede editar el partido porque ya comenzó o la ventana de pronóstico cerró.',
      });
    }

    const partidoActualizado = await Partido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ ok: true, data: partidoActualizado });
  } catch (error) {
    next(error);
  }
};

// PUT /api/partidos/:id/resultado  (solo admin - carga el resultado y dispara puntuación)
const cargarResultado = async (req, res, next) => {
  try {
    const { golesLocal, golesVisitante, penalesLocal, penalesVisitante } = req.body;

    const partido = await Partido.findById(req.params.id);
    if (!partido) return res.status(404).json({ ok: false, mensaje: 'Partido no encontrado' });
    if (partido.estado === 'finalizado') {
      return res.status(400).json({ ok: false, mensaje: 'El partido ya fue procesado' });
    }

    partido.resultado = { golesLocal, golesVisitante };
    if (penalesLocal !== undefined) {
      partido.penales = { golesLocal: penalesLocal, golesVisitante: penalesVisitante };
    }
    partido.estado = 'finalizado';
    partido.rankingsActualizados = false;
    await partido.save();

    const { procesados } = await procesarResultadoPartido(partido);

    partido.rankingsActualizados = true;
    await partido.save();

    await Torneo.findByIdAndUpdate(partido.torneo, { $inc: { partidosFinalizados: 1 } });

    req.app.get('io')?.to(`torneo:${partido.torneo}`).emit('partido:resultado', {
      partidoId: partido._id,
      resultado: partido.resultado,
      procesados,
    });

    res.json({ ok: true, data: partido, procesados });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPartidos, getPartido, crearPartido, actualizarPartido, cargarResultado };