const { Grupo, MiembroGrupo, RankingGrupos } = require('../models');

// POST /api/grupos
const crearGrupo = async (req, res, next) => {
  try {
    const { nombre, descripcion, torneoId, limiteMembers, esPrivado } = req.body;
    const grupo = await Grupo.create({
      nombre, descripcion, torneo: torneoId,
      limiteMembers, esPrivado, creador: req.usuario._id,
    });
    // El creador es admin del grupo
    await MiembroGrupo.create({ grupo: grupo._id, usuario: req.usuario._id, rol: 'admin' });
    res.status(201).json({ ok: true, data: grupo });
  } catch (error) { next(error); }
};

// POST /api/grupos/unirse
const unirseAGrupo = async (req, res, next) => {
  try {
    const { codigo } = req.body;
    const grupo = await Grupo.findOne({ codigoInvitacion: codigo.toUpperCase(), activo: true });
    if (!grupo) return res.status(404).json({ ok: false, mensaje: 'Código inválido o grupo inexistente' });

    if (grupo.limiteMembers && grupo.cantidadMiembros >= grupo.limiteMembers) {
      return res.status(400).json({ ok: false, mensaje: 'El grupo está lleno' });
    }

    const yaEsMiembro = await MiembroGrupo.findOne({ grupo: grupo._id, usuario: req.usuario._id });
    if (yaEsMiembro) return res.status(400).json({ ok: false, mensaje: 'Ya sos miembro de este grupo' });

    await MiembroGrupo.create({ grupo: grupo._id, usuario: req.usuario._id });
    await Grupo.findByIdAndUpdate(grupo._id, { $inc: { cantidadMiembros: 1 } });

    res.status(201).json({ ok: true, data: grupo });
  } catch (error) { next(error); }
};

// GET /api/grupos/mis-grupos
const getMisGrupos = async (req, res, next) => {
  try {
    const membresias = await MiembroGrupo.find({ usuario: req.usuario._id, activo: true })
      .populate('grupo');
    const grupos = membresias.map((m) => ({ ...m.grupo.toObject(), rolEnGrupo: m.rol }));
    res.json({ ok: true, data: grupos });
  } catch (error) { next(error); }
};

// GET /api/grupos/:id
const getGrupo = async (req, res, next) => {
  try {
    const grupo = await Grupo.findById(req.params.id).populate('creador', 'username avatar');
    if (!grupo) return res.status(404).json({ ok: false, mensaje: 'Grupo no encontrado' });
    res.json({ ok: true, data: grupo });
  } catch (error) { next(error); }
};

// GET /api/grupos/:id/miembros
const getMiembros = async (req, res, next) => {
  try {
    const miembros = await MiembroGrupo.find({ grupo: req.params.id, activo: true })
      .populate('usuario', 'username avatar nombre apellido stats')
      .sort({ puntajeEnGrupo: -1 });
    res.json({ ok: true, data: miembros });
  } catch (error) { next(error); }
};

module.exports = { crearGrupo, unirseAGrupo, getMisGrupos, getGrupo, getMiembros };