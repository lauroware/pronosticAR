// config/email.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarEmail = async ({ to, subject, html, text }) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM, // Debe ser una dirección verificada en SendGrid
    subject,
    text: text || '',
    html: html || '',
  };
  try {
    const response = await sgMail.send(msg);
    console.log(`✅ Email enviado a ${to}`);
    return response;
  } catch (error) {
    console.error('❌ Error enviando email con SendGrid:', error.response?.body || error);
    throw error;
  }
};

module.exports = { enviarEmail };