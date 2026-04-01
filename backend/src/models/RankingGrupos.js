const mongoose = require('mongoose');

// Ranking entre grupos: ¿qué grupo tiene el mejor promedio de puntos por miembro?
// Permite comparar grupos de distinto tamaño de forma justa.
const rankingGruposSchema = new mongoose.Schema(
  {
    torneo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Torneo',
      required: true,
    },
    grupo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grupo',
      required: true,
    },
    posicion: {
      type: Number,
      default: null,
    },
    posicionAnterior: {
      type: Number,
      default: null,
    },
    // Suma de puntajes de todos los miembros del grupo
    puntajeTotal: {
      type: Number,
      default: 0,
    },
    // Promedio por miembro (criterio de ranking entre grupos)
    promedioPorMiembro: {
      type: Number,
      default: 0,
    },
    cantidadMiembros: {
      type: Number,
      default: 0,
    },
    actualizadoAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

rankingGruposSchema.index({ torneo: 1, grupo: 1 }, { unique: true });
rankingGruposSchema.index({ torneo: 1, promedioPorMiembro: -1 });

const RankingGrupos = mongoose.model('RankingGrupos', rankingGruposSchema);
module.exports = RankingGrupos;