const { Usuario, Partido, Torneo, Pronostico, RankingGlobal } = require('../models');

// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [usuarios, partidos, pronosticos, torneos] = await Promise.all([
      Usuario.countDocuments(),
      Partido.countDocuments(),
      Pronostico.countDocuments(),
      Torneo.countDocuments(),
    ]);
    const pendientes  = await Partido.countDocuments({ estado: 'programado' });
    const finalizados = await Partido.countDocuments({ estado: 'finalizado' });
    res.json({ ok: true, data: { usuarios, partidos, pronosticos, torneos, pendientes, finalizados } });
  } catch (e) { next(e); }
};

// GET /api/admin/usuarios
const getUsuarios = async (req, res, next) => {
  try {
    const { page = 1, limit = 100, buscar } = req.query;
    const filtro = buscar
      ? { $or: [{ username: new RegExp(buscar, 'i') }, { email: new RegExp(buscar, 'i') }, { nombre: new RegExp(buscar, 'i') }] }
      : {};
    const [usuarios, total] = await Promise.all([
      Usuario.find(filtro).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Usuario.countDocuments(filtro),
    ]);
    res.json({ ok: true, data: usuarios.map((u) => u.toPublicJSON()), meta: { total, page: Number(page) } });
  } catch (e) { next(e); }
};

// PUT /api/admin/usuarios/:id/toggle
const toggleUsuario = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    usuario.activo = !usuario.activo;
    await usuario.save();
    res.json({ ok: true, data: usuario.toPublicJSON() });
  } catch (e) { next(e); }
};

// DELETE /api/admin/usuarios/:id  ← NUEVO
const eliminarUsuario = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    if (usuario.rol === 'admin') {
      return res.status(403).json({ ok: false, mensaje: 'No podés eliminar a otro administrador' });
    }
    // Eliminar sus pronósticos también
    await Pronostico.deleteMany({ usuario: req.params.id });
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ ok: true, mensaje: 'Usuario eliminado' });
  } catch (e) { next(e); }
};

// PUT /api/admin/usuarios/:id/rol
const cambiarRol = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, { rol: req.body.rol }, { new: true });
    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    res.json({ ok: true, data: usuario.toPublicJSON() });
  } catch (e) { next(e); }
};

// GET /api/admin/partidos  — todos los estados
const getPartidosAdmin = async (req, res, next) => {
  try {
    const { estado, page = 1, limit = 50 } = req.query;
    const filtro = {};
    if (estado) filtro.estado = estado;
    const [partidos, total] = await Promise.all([
      Partido.find(filtro).sort({ fechaHora: 1 }).skip((page - 1) * limit).limit(Number(limit)),
      Partido.countDocuments(filtro),
    ]);
    res.json({ ok: true, data: partidos, meta: { total, page: Number(page) } });
  } catch (e) { next(e); }
};

module.exports = { getStats, getUsuarios, toggleUsuario, eliminarUsuario, cambiarRol, getPartidosAdmin };