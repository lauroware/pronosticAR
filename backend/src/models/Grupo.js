const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const grupoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del grupo es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [60, 'El nombre no puede superar los 60 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [200, 'La descripción no puede superar los 200 caracteres'],
      default: '',
    },
    imagen: {
      type: String,
      default: null,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    torneo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Torneo',
      required: true,
    },
    // Código único para invitar a otros jugadores
    codigoInvitacion: {
      type: String,
      unique: true,
      default: () => uuidv4().slice(0, 8).toUpperCase(), // ej: "A3F7C9D2"
    },
    // Límite de miembros (null = sin límite)
    limiteMembers: {
      type: Number,
      min: 2,
      max: 200,
      default: null,
    },
    esPrivado: {
      type: Boolean,
      default: true, // por defecto los grupos son privados (solo por código)
    },
    activo: {
      type: Boolean,
      default: true,
    },
    // Desnormalizado para evitar queries extras
    cantidadMiembros: {
      type: Number,
      default: 1, // el creador es el primer miembro
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ------- Índices -------
grupoSchema.index({ codigoInvitacion: 1 });
grupoSchema.index({ creador: 1 });
grupoSchema.index({ torneo: 1 });

const Grupo = mongoose.model('Grupo', grupoSchema);
module.exports = Grupo;