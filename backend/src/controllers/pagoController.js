const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { Grupo, MiembroGrupo } = require('../models');

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const PRECIO_UPGRADE = Number(process.env.PRECIO_UPGRADE_ARS) || 5000; // ARS

// POST /api/pagos/crear-preferencia
// El admin del grupo solicita el link de pago para desbloquear su grupo
const crearPreferencia = async (req, res, next) => {
  try {
    const { grupoId } = req.body;

    const grupo = await Grupo.findById(grupoId);
    if (!grupo) {
      return res.status(404).json({ ok: false, mensaje: 'Grupo no encontrado' });
    }

    // Solo el admin del grupo puede pagar el upgrade
    const esAdmin = await MiembroGrupo.findOne({
      grupo: grupoId,
      usuario: req.usuario._id,
      rol: 'admin',
    });
    if (!esAdmin) {
      return res.status(403).json({ ok: false, mensaje: 'Solo el administrador puede hacer el upgrade' });
    }

    if (grupo.premium) {
      return res.status(400).json({ ok: false, mensaje: 'Este grupo ya es Premium' });
    }

    const preference = new Preference(mp);
    const result = await preference.create({
      body: {
        items: [
          {
            id:          grupoId,
            title:       `PronosticAR — Grupo "${grupo.nombre}" Premium`,
            description: 'Hasta 50 miembros por el resto del Mundial 2026',
            quantity:    1,
            unit_price:  PRECIO_UPGRADE,
            currency_id: 'ARS',
          },
        ],
        payer: {
          email: req.usuario.email,
        },
        back_urls: {
          success: `${process.env.CLIENT_URL}/pago/exitoso?grupo=${grupoId}`,
          failure: `${process.env.CLIENT_URL}/pago/fallido?grupo=${grupoId}`,
          pending: `${process.env.CLIENT_URL}/pago/pendiente?grupo=${grupoId}`,
        },
        auto_return: 'approved',
        // MP llama a este endpoint cuando el pago se aprueba
        notification_url: `${process.env.API_URL}/api/pagos/webhook`,
        // Guardamos el grupoId para identificarlo en el webhook
        external_reference: grupoId,
        statement_descriptor: 'PronosticAR',
      },
    });

    res.json({
      ok: true,
      checkoutUrl: result.init_point,       // URL de producción
      checkoutUrlTest: result.sandbox_init_point, // URL de prueba
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/pagos/webhook
// MercadoPago avisa cuando el pago fue aprobado
const webhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    // Solo procesamos notificaciones de pago
    if (type !== 'payment' || !data?.id) {
      return res.sendStatus(200);
    }

    // Consultamos el pago a la API de MP para verificar que es real
    const payment = new Payment(mp);
    const pagoInfo = await payment.get({ id: data.id });

    if (pagoInfo.status !== 'approved') {
      return res.sendStatus(200); // no aprobado, ignoramos
    }

    const grupoId = pagoInfo.external_reference;
    if (!grupoId) return res.sendStatus(200);

    // Activamos premium en el grupo
    await Grupo.findByIdAndUpdate(grupoId, {
      premium:           true,
      limitePlan:        50,
      mpPagoId:          String(pagoInfo.id),
      premiumActivadoEn: new Date(),
    });

    console.log(`✅ Grupo ${grupoId} activado como Premium — Pago MP #${pagoInfo.id}`);
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error en webhook MP:', error.message);
    // Siempre devolver 200 a MP para que no reintente indefinidamente
    res.sendStatus(200);
  }
};

// GET /api/pagos/estado/:grupoId
// El frontend consulta si el grupo ya fue activado (por si el webhook tardó)
const estadoPago = async (req, res, next) => {
  try {
    const grupo = await Grupo.findById(req.params.grupoId).select('premium limitePlan nombre');
    if (!grupo) return res.status(404).json({ ok: false, mensaje: 'Grupo no encontrado' });
    res.json({ ok: true, data: { premium: grupo.premium, limitePlan: grupo.limitePlan, nombre: grupo.nombre } });
  } catch (error) {
    next(error);
  }
};

module.exports = { crearPreferencia, webhook, estadoPago };