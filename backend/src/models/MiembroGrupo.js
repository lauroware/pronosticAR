const mongoose = require('mongoose');

const miembroGrupoSchema = new mongoose.Schema(
  {
    grupo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grupo',
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    rol: {
      type: String,
      enum: ['admin', 'miembro'],
      default: 'miembro',
      // El creador del grupo tiene rol 'admin', puede gestionar el grupo
    },
    // Puntaje acumulado DENTRO de este grupo (puede ser diferente al global
    // si el grupo empezó en una fecha posterior al torneo)
    puntajeEnGrupo: {
      type: Number,
      default: 0,
    },
    posicion: {
      type: Number,
      default: null, // se calcula y persiste al actualizar rankings
    },
    activo: {
      type: Boolean,
      default: true,
    },
    // Cuándo se unió al grupo
    fechaIngreso: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Un usuario solo puede estar una vez en el mismo grupo
miembroGrupoSchema.index({ grupo: 1, usuario: 1 }, { unique: true });
miembroGrupoSchema.index({ grupo: 1, puntajeEnGrupo: -1 }); // para ranking interno
miembroGrupoSchema.index({ usuario: 1 }); // para listar grupos de un usuario

const MiembroGrupo = mongoose.model('MiembroGrupo', miembroGrupoSchema);
module.exports = MiembroGrupo;