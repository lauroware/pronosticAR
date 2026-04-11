// config/email.js
const Brevo = require('@getbrevo/brevo');

let apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const enviarEmail = async ({ to, subject, html, text }) => {
    let sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.to = [{ email: to, name: to }];
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.textContent = text || '';
    sendSmtpEmail.sender = { email: process.env.EMAIL_FROM, name: "PronosticAR" };

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email enviado a:', to);
        return data;
    } catch (error) {
        console.error('❌ Error al enviar con Brevo:', error);
        throw error;
    }
};

module.exports = { enviarEmail };