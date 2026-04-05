const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String, required: [true, 'El nombre es obligatorio'],
      trim: true, minlength: 2, maxlength: 50,
    },
    apellido: {
      type: String, required: [true, 'El apellido es obligatorio'],
      trim: true, minlength: 2, maxlength: 50,
    },
    username: {
      type: String, required: [true, 'El username es obligatorio'],
      unique: true, trim: true, lowercase: true,
      minlength: 3, maxlength: 30,
      match: [/^[a-z0-9_.-]+$/, 'Username inválido'],
    },
    email: {
      type: String, required: [true, 'El email es obligatorio'],
      unique: true, trim: true, lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    password: {
      type: String, required: true, minlength: 6, select: false,
    },
    avatar:          { type: String, default: null },
    rol:             { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
    activo:          { type: Boolean, default: true },
    emailVerificado: { type: Boolean, default: false },
    tokenResetPassword: { type: String, select: false },
    tokenResetExpira:   { type: Date,   select: false },

    stats: {
      totalPronosticos: { type: Number, default: 0 },
      aciertosExactos:  { type: Number, default: 0 },
      aciertosGanador:  { type: Number, default: 0 },
      fallos:           { type: Number, default: 0 },
      puntajeTotal:     { type: Number, default: 0 },
    },

    // ── PRONÓSTICO FINAL (elegido al registrarse, no editable) ───────────
    // Cada posición guarda el código FIFA del equipo elegido (ej: 'ARG')
    pronosticoFinal: {
      campeon:  { type: String, default: null, uppercase: true, maxlength: 3 },
      segundo:  { type: String, default: null, uppercase: true, maxlength: 3 },
      tercero:  { type: String, default: null, uppercase: true, maxlength: 3 },
      cuarto:   { type: String, default: null, uppercase: true, maxlength: 3 },
      // Se bloquea automáticamente cuando el usuario guarda los 4
      bloqueado: { type: Boolean, default: false },
      // Puntos acumulados por aciertos del pronóstico final
      puntosObtenidos: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

usuarioSchema.virtual('nombreCompleto').get(function () {
  return `${this.nombre} ${this.apellido}`;
});

usuarioSchema.virtual('efectividad').get(function () {
  const resueltos = this.stats.aciertosExactos + this.stats.aciertosGanador + this.stats.fallos;
  if (resueltos === 0) return 0;
  return Math.round(((this.stats.aciertosExactos + this.stats.aciertosGanador) / resueltos) * 100);
});

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usuarioSchema.methods.compararPassword = async function (pw) {
  return bcrypt.compare(pw, this.password);
};

usuarioSchema.methods.toPublicJSON = function () {
  return {
    id:               this._id,
    nombre:           this.nombre,
    apellido:         this.apellido,
    username:         this.username,
    email:            this.email,
    avatar:           this.avatar,
    rol:              this.rol,
    stats:            this.stats,
    efectividad:      this.efectividad,
    pronosticoFinal:  this.pronosticoFinal,
    createdAt:        this.createdAt,
  };
};

usuarioSchema.index({ email: 1 });
usuarioSchema.index({ username: 1 });
usuarioSchema.index({ 'stats.puntajeTotal': -1 });

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;