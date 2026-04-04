const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true para 465, false para otros
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enviarEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"PronosticAR" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || '',
      html: html || '',
    });
    console.log(`✅ Email enviado a ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
};

module.exports = { enviarEmail };