const { Pronostico, Partido } = require('../models');

// POST /api/pronosticos  - crear o actualizar pronóstico
const crearOActualizar = async (req, res, next) => {
  try {
    const { partidoId, golesLocal, golesVisitante } = req.body;
    const usuarioId = req.usuario._id;

    const partido = await Partido.findById(partidoId);
    if (!partido) return res.status(404).json({ ok: false, mensaje: 'Partido no encontrado' });
    if (!partido.estaAbierto) return res.status(400).json({ ok: false, mensaje: 'El pronóstico está cerrado para este partido' });

    const pronostico = await Pronostico.findOneAndUpdate(
      { usuario: usuarioId, partido: partidoId },
      { prediccion: { golesLocal, golesVisitante } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Si es nuevo, incrementar contador en el partido
    await Partido.findByIdAndUpdate(partidoId, { $inc: { totalPronosticos: 1 } });

    res.status(201).json({ ok: true, data: pronostico });
  } catch (error) { next(error); }
};

// GET /api/pronosticos/mis-pronosticos?torneoId=id
const getMisPronosticos = async (req, res, next) => {
  try {
    const { torneoId } = req.query;

    // Buscar partidos del torneo para filtrar
    const filtro = { usuario: req.usuario._id };
    if (torneoId) {
      const { Partido } = require('../models');
      const partidos = await Partido.find({ torneo: torneoId }).select('_id');
      filtro.partido = { $in: partidos.map((p) => p._id) };
    }

    const pronosticos = await Pronostico.find(filtro)
      .populate('partido', 'equipoLocal equipoVisitante fechaHora estado resultado fase')
      .sort({ createdAt: -1 });

    res.json({ ok: true, data: pronosticos });
  } catch (error) { next(error); }
};

// GET /api/pronosticos/partido/:partidoId  - ver pronósticos de un partido (después de que cierra)
const getPronosticosPartido = async (req, res, next) => {
  try {
    const partido = await Partido.findById(req.params.partidoId);
    if (!partido) return res.status(404).json({ ok: false, mensaje: 'Partido no encontrado' });

    // Solo mostrar pronósticos ajenos cuando el partido ya cerró
    if (partido.estaAbierto) {
      return res.status(403).json({ ok: false, mensaje: 'Los pronósticos se revelan cuando cierra el partido' });
    }

    const pronosticos = await Pronostico.find({ partido: req.params.partidoId })
      .populate('usuario', 'username avatar nombre')
      .sort({ puntos: -1 });

    res.json({ ok: true, data: pronosticos });
  } catch (error) { next(error); }
};

module.exports = { crearOActualizar, getMisPronosticos, getPronosticosPartido };