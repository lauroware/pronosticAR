const { Grupo, MiembroGrupo } = require('../models');

const esMiembro = async (grupoId, usuarioId) =>
  !!(await MiembroGrupo.findOne({ grupo: grupoId, usuario: usuarioId, activo: true }));

const esAdmin = async (grupoId, usuarioId) =>
  !!(await MiembroGrupo.findOne({ grupo: grupoId, usuario: usuarioId, rol: 'admin', activo: true }));

const obtenerGruposDeUsuario = async (usuarioId) =>
  MiembroGrupo.find({ usuario: usuarioId, activo: true }).populate('grupo');

module.exports = { esMiembro, esAdmin, obtenerGruposDeUsuario };