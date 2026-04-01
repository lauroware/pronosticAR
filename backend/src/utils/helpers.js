// Paginar resultados
const paginar = (query, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

// Respuesta estandarizada
const responder = (res, { status = 200, ok = true, data = null, mensaje = null, meta = null }) => {
  const body = { ok };
  if (mensaje) body.mensaje = mensaje;
  if (data !== null) body.data = data;
  if (meta) body.meta = meta;
  return res.status(status).json(body);
};

module.exports = { paginar, responder };