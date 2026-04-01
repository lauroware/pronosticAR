const mongoose = require('mongoose');

// Sub-schema para el resultado (usado en el partido real y en pronósticos)
const resultadoSchema = new mongoose.Schema(
  {
    golesLocal:    { type: Number, min: 0, default: null },
    golesVisitante: { type: Number, min: 0, default: null },
  },
  { _id: false }
);

const partidoSchema = new mongoose.Schema(
  {
    torneo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Torneo',
      required: true,
    },
    fase: {
      type: String,
      enum: ['grupos', 'octavos', 'cuartos', 'semifinal', 'tercer_puesto', 'final'],
      required: true,
    },
    grupoFase: {
      // Solo para fase 'grupos': A, B, C ... H
      type: String,
      default: null,
    },
    equipoLocal: {
      nombre:    { type: String, required: true, trim: true },
      codigoPais: { type: String, required: true, uppercase: true, maxlength: 3 }, // ARG, BRA, etc.
      escudo:    { type: String, default: null },
    },
    equipoVisitante: {
      nombre:    { type: String, required: true, trim: true },
      codigoPais: { type: String, required: true, uppercase: true, maxlength: 3 },
      escudo:    { type: String, default: null },
    },
    fechaHora: {
      type: Date,
      required: true,
    },
    estadio: {
      type: String,
      trim: true,
      default: null,
    },
    estado: {
      type: String,
      enum: ['programado', 'en_curso', 'finalizado', 'suspendido', 'postergado'],
      default: 'programado',
    },
    resultado: {
      type: resultadoSchema,
      default: () => ({ golesLocal: null, golesVisitante: null }),
    },
    // Si hubo penales (KO), se guarda el marcador de penales aparte
    penales: {
      golesLocal:    { type: Number, min: 0, default: null },
      golesVisitante: { type: Number, min: 0, default: null },
    },
    // Timestamp en que se cerró el pronóstico (normalmente = fechaHora del partido)
    cierrePronóstico: {
      type: Date,
      default: null,
    },
    // Flag para saber si los rankings ya fueron recalculados después de este partido
    rankingsActualizados: {
      type: Boolean,
      default: false,
    },
    // Cuántos usuarios hicieron un pronóstico (desnormalizado para stats)
    totalPronosticos: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ------- Virtuals -------

partidoSchema.virtual('estaAbierto').get(function () {
  const cierre = this.cierrePronóstico || this.fechaHora;
  return this.estado === 'programado' && new Date() < cierre;
});

partidoSchema.virtual('ganador').get(function () {
  const r = this.resultado;
  if (r.golesLocal === null || r.golesVisitante === null) return null;
  if (r.golesLocal > r.golesVisitante) return 'local';
  if (r.golesVisitante > r.golesLocal) return 'visitante';
  return 'empate';
});

// ------- Índices -------
partidoSchema.index({ torneo: 1, fechaHora: 1 });
partidoSchema.index({ estado: 1 });
partidoSchema.index({ fechaHora: 1 });

const Partido = mongoose.model('Partido', partidoSchema);
module.exports = Partido;