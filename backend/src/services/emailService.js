const { enviarEmail } = require('../config/email');


const enviarResetPassword = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">PronosticAR</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
        <h2 style="color: #1e293b;">Restablecé tu contraseña</h2>
        <p style="color: #475569;">Hacé clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${url}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Restablecer contraseña
        </a>
        <p style="color: #64748b; font-size: 14px;">Si no solicitaste este cambio, ignorá este mensaje.</p>
        <p style="color: #64748b; font-size: 14px;">El enlace expira en 30 minutos.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px;">Si el botón no funciona, copiá este link: ${url}</p>
      </div>
    </div>
  `;
  
  await enviarEmail({
    to: email,
    subject: 'Restablecé tu contraseña - PronosticAR',
    html,
  });
};

const enviarBienvenida = async (email, nombre) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">PronosticAR</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
        <h2 style="color: #1e293b;">¡Bienvenido, ${nombre}! 🏆</h2>
        <p style="color: #475569;">Gracias por registrarte en PronosticAR. Ya podés:</p>
        <ul style="color: #475569;">
          <li>⚽ Hacer tus pronósticos del Mundial</li>
          <li>👥 Crear grupos con tus amigos</li>
          <li>🏆 Competir en el ranking global</li>
        </ul>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Ir al dashboard
        </a>
      </div>
    </div>
  `;
  
  await enviarEmail({
    to: email,
    subject: '¡Bienvenido a PronosticAR!',
    html,
  });
};

module.exports = { enviarResetPassword, enviarBienvenida };