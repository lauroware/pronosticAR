const { Torneo } = require('../models');

const getTorneos = async (req, res, next) => {
  try {
    const torneos = await Torneo.find().sort({ fechaInicio: -1 });
    res.json({ ok: true, data: torneos });
  } catch (e) { next(e); }
};

const getTorneoActivo = async (req, res, next) => {
  try {
    const torneo = await Torneo.findOne({ activo: true });
    if (!torneo) return res.status(404).json({ ok: false, mensaje: 'No hay torneo activo' });
    res.json({ ok: true, data: torneo });
  } catch (e) { next(e); }
};

const getTorneo = async (req, res, next) => {
  try {
    const torneo = await Torneo.findById(req.params.id);
    if (!torneo) return res.status(404).json({ ok: false, mensaje: 'Torneo no encontrado' });
    res.json({ ok: true, data: torneo });
  } catch (e) { next(e); }
};

const crearTorneo = async (req, res, next) => {
  try {
    // Si el nuevo torneo es activo, desactivar los demás
    if (req.body.activo) await Torneo.updateMany({}, { activo: false });
    const torneo = await Torneo.create(req.body);
    res.status(201).json({ ok: true, data: torneo });
  } catch (e) { next(e); }
};

const actualizarTorneo = async (req, res, next) => {
  try {
    if (req.body.activo) await Torneo.updateMany({ _id: { $ne: req.params.id } }, { activo: false });
    const torneo = await Torneo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!torneo) return res.status(404).json({ ok: false, mensaje: 'Torneo no encontrado' });
    res.json({ ok: true, data: torneo });
  } catch (e) { next(e); }
};

module.exports = { getTorneos, getTorneoActivo, getTorneo, crearTorneo, actualizarTorneo };