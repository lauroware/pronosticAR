const { RankingGlobal, RankingGrupos, HistorialRanking, MiembroGrupo, Usuario } = require('../models');

// GET /api/rankings/global
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

// GET /api/rankings/grupos
const getRankingEntreGrupos = async (req, res, next) => {
  try {
    const rankings = await RankingGrupos.find({ torneo: req.query.torneoId })
      .populate('grupo', 'nombre imagen cantidadMiembros')
      .sort({ posicion: 1 });
    res.json({ ok: true, data: rankings });
  } catch (error) { next(error); }
};

// GET /api/rankings/evolucion/:usuarioId
const getEvolucion = async (req, res, next) => {
  try {
    const { torneoId, grupoId } = req.query;
    const filtro = { torneo: torneoId, usuario: req.params.usuarioId };
    if (grupoId) filtro.grupo = grupoId;
    const historial = await HistorialRanking.find(filtro).sort({ fechaPartido: 1 });
    res.json({ ok: true, data: historial });
  } catch (error) { next(error); }
};

// GET /api/rankings/mi-posicion
const getMiPosicion = async (req, res, next) => {
  try {
    const { torneoId } = req.query;
    const ranking = await RankingGlobal.findOne({ torneo: torneoId, usuario: req.usuario._id });
    res.json({ ok: true, data: ranking });
  } catch (error) { next(error); }
};

// GET /api/rankings/stats-pronostico-final
// Devuelve el % de elección para cada puesto (campeon, segundo, tercero, cuarto)
const getStatsPronosticoFinal = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find({
      'pronosticoFinal.bloqueado': true,
    }).select('pronosticoFinal');

    const total = usuarios.length;
    if (total === 0) {
      return res.json({ ok: true, data: { total: 0, campeon: [], segundo: [], tercero: [], cuarto: [] } });
    }

    // Contar votos por puesto
    const contar = (campo) => {
      const mapa = {};
      for (const u of usuarios) {
        const cod = u.pronosticoFinal?.[campo];
        if (cod) mapa[cod] = (mapa[cod] || 0) + 1;
      }
      // Ordenar de mayor a menor y calcular porcentaje
      return Object.entries(mapa)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([codigo, votos]) => ({
          codigo,
          votos,
          porcentaje: Math.round((votos / total) * 100),
        }));
    };

    res.json({
      ok: true,
      data: {
        total,
        campeon: contar('campeon'),
        segundo: contar('segundo'),
        tercero: contar('tercero'),
        cuarto:  contar('cuarto'),
      },
    });
  } catch (error) { next(error); }
};

module.exports = {
  getRankingGlobal, getRankingGrupo, getRankingEntreGrupos,
  getEvolucion, getMiPosicion, getStatsPronosticoFinal,
};