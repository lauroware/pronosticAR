const Novedad = require('../models/Novedad');

const getNovedades = async (req, res, next) => {
  try {
    const novedades = await Novedad.find().sort({ createdAt: -1 }).populate('autor', 'username nombre');
    res.json({ ok: true, data: novedades });
  } catch (error) { next(error); }
};

const crearNovedad = async (req, res, next) => {
  try {
    const novedad = await Novedad.create({
      ...req.body,
      autor: req.usuario._id
    });
    res.status(201).json({ ok: true, data: novedad });
  } catch (error) { next(error); }
};

const eliminarNovedad = async (req, res, next) => {
  try {
    await Novedad.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) { next(error); }
};

module.exports = { getNovedades, crearNovedad, eliminarNovedad };