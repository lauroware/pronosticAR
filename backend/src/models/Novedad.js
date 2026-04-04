const mongoose = require('mongoose');

const novedadSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  contenido: {
    type: String,
    required: true
  },
  imagen: {
    type: String,
    default: null
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  destacada: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Novedad', novedadSchema);