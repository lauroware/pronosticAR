const mongoose = require('mongoose');

// Constantes de puntuación (única fuente de verdad)
const PUNTOS = {
  EXACTO:   3,  // acertó resultado exacto
  GANADOR:  1,  // acertó ganador/empate pero no el marcador exacto
  FALLO:    0,  // no acertó nada
};

const pronosticoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    partido: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partido',
      required: true,
    },
    // Lo que el usuario apostó
    prediccion: {
      golesLocal:     { type: Number, required: true, min: 0, max: 30 },
      golesVisitante: { type: Number, required: true, min: 0, max: 30 },
    },
    // Se calcula automáticamente una vez que el partido finaliza
    puntos: {
      type: Number,
      enum: [PUNTOS.EXACTO, PUNTOS.GANADOR, PUNTOS.FALLO],
      default: null,
    },
    tipoPremio: {
      type: String,
      enum: ['exacto', 'ganador', 'fallo', null],
      default: null,
    },
    // Cuándo fue evaluado (cuando el admin cargó el resultado del partido)
    evaluadoAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ------- Regla de unicidad: un usuario, un pronóstico por partido -------
pronosticoSchema.index({ usuario: 1, partido: 1 }, { unique: true });

// ------- Índices adicionales -------
pronosticoSchema.index({ partido: 1 });
pronosticoSchema.index({ usuario: 1, puntos: 1 });

// ------- Método estático: calcular puntos -------
// Se llama cuando el admin registra el resultado del partido.
// Recibe el resultado real del partido, devuelve { puntos, tipoPremio }
pronosticoSchema.statics.calcularPuntos = function (prediccion, resultadoReal) {
  const { golesLocal: pL, golesVisitante: pV } = prediccion;
  const { golesLocal: rL, golesVisitante: rV } = resultadoReal;

  // 3 pts: resultado exacto
  if (pL === rL && pV === rV) {
    return { puntos: PUNTOS.EXACTO, tipoPremio: 'exacto' };
  }

  // 1 pt: acertó el ganador o el empate
  const ganadorPrediccion = pL > pV ? 'local' : pL < pV ? 'visitante' : 'empate';
  const ganadorReal       = rL > rV ? 'local' : rL < rV ? 'visitante' : 'empate';

  if (ganadorPrediccion === ganadorReal) {
    return { puntos: PUNTOS.GANADOR, tipoPremio: 'ganador' };
  }

  // 0 pts: fallo
  return { puntos: PUNTOS.FALLO, tipoPremio: 'fallo' };
};

// ------- Método de instancia: evaluar y guardar -------
pronosticoSchema.methods.evaluar = function (resultadoReal) {
  const { puntos, tipoPremio } = this.constructor.calcularPuntos(this.prediccion, resultadoReal);
  this.puntos     = puntos;
  this.tipoPremio = tipoPremio;
  this.evaluadoAt = new Date();
  return this;
};

// Exportar constantes junto con el modelo para usarlas en services
const Pronostico = mongoose.model('Pronostico', pronosticoSchema);
Pronostico.PUNTOS = PUNTOS;
module.exports = Pronostico;