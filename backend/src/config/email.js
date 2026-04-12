// config/email.js
const axios = require('axios');

const enviarEmail = async ({ to, subject, html, text }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;

  if (!apiKey) {
    throw new Error('❌ BREVO_API_KEY no está definida en Render');
  }
  if (!fromEmail) {
    throw new Error('❌ EMAIL_FROM no está definida en Render');
  }

  const data = {
    sender: { email: fromEmail, name: 'PronosticAR' },
    to: [{ email: to }],
    subject: subject,
    htmlContent: html,
    textContent: text || '',
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ Email enviado a ${to}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error enviando email con Brevo:');
    if (error.response) {
      console.error('   Respuesta:', error.response.data);
    } else {
      console.error('   Mensaje:', error.message);
    }
    throw error;
  }
};

module.exports = { enviarEmail };