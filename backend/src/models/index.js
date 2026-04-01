// Punto de entrada único para todos los modelos.
// Importar desde acá evita errores de modelos no registrados en Mongoose.

const Usuario        = require('./Usuario');
const Torneo         = require('./Torneo');
const Partido        = require('./Partido');
const Pronostico     = require('./Pronostico.Js');
const Grupo          = require('./Grupo');
const MiembroGrupo   = require('./MiembroGrupo');
const RankingGlobal  = require('./RankingGlobal');
const RankingGrupos  = require('./RankingGrupos');
const HistorialRanking = require('./HistorialRanking');

module.exports = {
  Usuario,
  Torneo,
  Partido,
  Pronostico,
  Grupo,
  MiembroGrupo,
  RankingGlobal,
  RankingGrupos,
  HistorialRanking,
};