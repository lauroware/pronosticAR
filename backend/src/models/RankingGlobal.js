const mongoose = require('mongoose');

// Una entrada por usuario por torneo.
// Se actualiza cada vez que se resuelven partidos.
const rankingGlobalSchema = new mongoose.Schema(
  {
    torneo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Torneo',
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    posicion: {
      type: Number,
      default: null,
    },
    posicionAnterior: {
      type: Number,
      default: null, // útil para mostrar flechas de subida/bajada en la UI
    },
    puntaje: {
      type: Number,
      default: 0,
    },
    // Desglose de puntos
    desglose: {
      exactos:  { type: Number, default: 0 }, // cantidad de pronósticos de 3 pts
      ganadores: { type: Number, default: 0 }, // cantidad de 1 pt
      fallos:   { type: Number, default: 0 },
    },
    // Total de pronósticos realizados (para desempate y stats)
    totalPronosticos: {
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

// Una entrada por usuario por torneo
rankingGlobalSchema.index({ torneo: 1, usuario: 1 }, { unique: true });
rankingGlobalSchema.index({ torneo: 1, puntaje: -1 }); // para listar el ranking ordenado
rankingGlobalSchema.index({ torneo: 1, posicion: 1 });

const RankingGlobal = mongoose.model('RankingGlobal', rankingGlobalSchema);
module.exports = RankingGlobal;