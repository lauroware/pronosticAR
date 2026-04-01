const mongoose = require('mongoose');

const torneoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del torneo es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar los 100 caracteres'],
    },
    // "Mundial 2026", "Eurocopa 2024", etc.
    edicion: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: true,
    },
    estado: {
      type: String,
      enum: ['proximo', 'en_curso', 'finalizado'],
      default: 'proximo',
    },
    // Si true, es el torneo activo por defecto (solo puede haber uno activo)
    activo: {
      type: Boolean,
      default: false,
    },
    // Reglas de puntuación (permite customizar por torneo si el día de mañana quieren)
    reglasPuntuacion: {
      exacto:   { type: Number, default: 3 },
      ganador:  { type: Number, default: 1 },
      fallo:    { type: Number, default: 0 },
    },
    descripcion: {
      type: String,
      default: '',
      maxlength: [500],
    },
    totalPartidos: {
      type: Number,
      default: 0,
    },
    partidosFinalizados: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

torneoSchema.index({ activo: 1 });
torneoSchema.index({ estado: 1 });

const Torneo = mongoose.model('Torneo', torneoSchema);
module.exports = Torneo;