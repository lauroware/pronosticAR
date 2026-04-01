const mongoose = require('mongoose');

// Snapshot del ranking después de cada partido.
// Sirve para el gráfico de evolución de posiciones.
const historialRankingSchema = new mongoose.Schema(
  {
    torneo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Torneo',
      required: true,
    },
    partido: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partido',
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    grupo: {
      // null = snapshot del ranking global
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grupo',
      default: null,
    },
    posicion:      { type: Number, required: true },
    puntaje:       { type: Number, required: true },
    puntajePartido: { type: Number, required: true, default: 0 }, // pts ganados en ESE partido
    fechaPartido:  { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

historialRankingSchema.index({ torneo: 1, usuario: 1, fechaPartido: 1 });
historialRankingSchema.index({ torneo: 1, grupo: 1, usuario: 1, fechaPartido: 1 });
historialRankingSchema.index({ partido: 1 });

const HistorialRanking = mongoose.model('HistorialRanking', historialRankingSchema);
module.exports = HistorialRanking;