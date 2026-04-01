const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede superar los 50 caracteres'],
    },
    apellido: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true,
      minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
      maxlength: [50, 'El apellido no puede superar los 50 caracteres'],
    },
    username: {
      type: String,
      required: [true, 'El username es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'El username debe tener al menos 3 caracteres'],
      maxlength: [30, 'El username no puede superar los 30 caracteres'],
      match: [/^[a-z0-9_.-]+$/, 'El username solo puede contener letras, números, guiones y puntos'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    rol: {
      type: String,
      enum: ['usuario', 'admin'],
      default: 'usuario',
    },
    activo: {
      type: Boolean,
      default: true,
    },
    emailVerificado: {
      type: Boolean,
      default: false,
    },
    tokenResetPassword: {
      type: String,
      select: false,
    },
    tokenResetExpira: {
      type: Date,
      select: false,
    },
    stats: {
      totalPronosticos: { type: Number, default: 0 },
      aciertosExactos:  { type: Number, default: 0 },
      aciertosGanador:  { type: Number, default: 0 },
      fallos:           { type: Number, default: 0 },
      puntajeTotal:     { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ------- Virtuals -------
usuarioSchema.virtual('nombreCompleto').get(function () {
  return `${this.nombre} ${this.apellido}`;
});

usuarioSchema.virtual('efectividad').get(function () {
  const resueltos = this.stats.aciertosExactos + this.stats.aciertosGanador + this.stats.fallos;
  if (resueltos === 0) return 0;
  return Math.round(((this.stats.aciertosExactos + this.stats.aciertosGanador) / resueltos) * 100);
});

// ------- Middleware -------
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ------- Métodos de instancia -------
usuarioSchema.methods.compararPassword = async function (passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.password);
};

usuarioSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    nombre: this.nombre,
    apellido: this.apellido,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    rol: this.rol,
    stats: this.stats,
    efectividad: this.efectividad,
    createdAt: this.createdAt,
  };
};

// ------- Índices -------
usuarioSchema.index({ email: 1 });
usuarioSchema.index({ username: 1 });
usuarioSchema.index({ 'stats.puntajeTotal': -1 });

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;