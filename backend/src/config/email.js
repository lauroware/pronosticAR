// config/email.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarEmail = async ({ to, subject, html, text }) => {
  // Validar que haya al menos un contenido
  if (!html && !text) {
    throw new Error('Debes proporcionar html o text');
  }

  const msg = {
    to,
    from: {
      email: process.env.EMAIL_FROM, // Debe ser una dirección verificada en SendGrid
      name: 'PronosticAR',
    },
    subject,
    text: text || '',
    html: html || '',
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email enviado a ${to}`);
  } catch (error) {
    console.error('❌ Error SendGrid:', error.response?.body || error);
    throw error;
  }
};

module.exports = { enviarEmail };