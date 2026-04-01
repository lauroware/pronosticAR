const { RankingGlobal, RankingGrupos, HistorialRanking, MiembroGrupo } = require('../models');

// GET /api/rankings/global?torneoId=id&page=1
const getRankingGlobal = async (req, res, next) => {
  try {
    const { torneoId, page = 1, limit = 50 } = req.query;
    const [rankings, total] = await Promise.all([
      RankingGlobal.find({ torneo: torneoId })
        .populate('usuario', 'username avatar nombre apellido')
        .sort({ posicion: 1 })
        .skip((page - 1) * limit).limit(Number(limit)),
      RankingGlobal.countDocuments({ torneo: torneoId }),
    ]);
    res.json({ ok: true, data: rankings, meta: { total, page: Number(page) } });
  } catch (error) { next(error); }
};

// GET /api/rankings/grupo/:grupoId
const getRankingGrupo = async (req, res, next) => {
  try {
    const miembros = await MiembroGrupo.find({ grupo: req.params.grupoId, activo: true })
      .populate('usuario', 'username avatar nombre apellido')
      .sort({ posicion: 1 });
    res.json({ ok: true, data: miembros });
  } catch (error) { next(error); }
};

// GET /api/rankings/grupos?torneoId=id
const getRankingEntreGrupos = async (req, res, next) => {
  try {
    const rankings = await RankingGrupos.find({ torneo: req.query.torneoId })
      .populate('grupo', 'nombre imagen cantidadMiembros')
      .sort({ posicion: 1 });
    res.json({ ok: true, data: rankings });
  } catch (error) { next(error); }
};

// GET /api/rankings/evolucion/:usuarioId?torneoId=id
const getEvolucion = async (req, res, next) => {
  try {
    const { torneoId, grupoId } = req.query;
    const filtro = { torneo: torneoId, usuario: req.params.usuarioId };
    if (grupoId) filtro.grupo = grupoId;
    const historial = await HistorialRanking.find(filtro).sort({ fechaPartido: 1 });
    res.json({ ok: true, data: historial });
  } catch (error) { next(error); }
};

// GET /api/rankings/mi-posicion?torneoId=id
const getMiPosicion = async (req, res, next) => {
  try {
    const { torneoId } = req.query;
    const ranking = await RankingGlobal.findOne({ torneo: torneoId, usuario: req.usuario._id });
    res.json({ ok: true, data: ranking });
  } catch (error) { next(error); }
};

module.exports = { getRankingGlobal, getRankingGrupo, getRankingEntreGrupos, getEvolucion, getMiPosicion };