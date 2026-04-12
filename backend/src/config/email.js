// config/email.js
const brevo = require('@getbrevo/brevo');

// Crear instancia de la API transaccional
let apiInstance = new brevo.TransactionalEmailsApi();

// Configurar la clave API
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const enviarEmail = async ({ to, subject, html, text }) => {
  // Validar que la variable de entorno EMAIL_FROM esté definida
  const fromEmail = process.env.EMAIL_FROM;
  if (!fromEmail) {
    throw new Error('La variable de entorno EMAIL_FROM no está definida en Render');
  }

  // Validar que haya al menos un contenido
  if (!html && !text) {
    throw new Error('Debes proporcionar html o text');
  }

  // Crear el objeto de correo
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.to = [{ email: to, name: to.split('@')[0] }];
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.textContent = text || '';
  sendSmtpEmail.sender = { email: fromEmail, name: 'PronosticAR' };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email enviado a ${to}`);
    return data;
  } catch (error) {
    console.error('❌ Error enviando email con Brevo:', error.response?.body || error);
    throw error;
  }
};

module.exports = { enviarEmail };