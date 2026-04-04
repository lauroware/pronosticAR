// Stub — conectar nodemailer en producción
const enviarResetPassword = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  console.log(`[EMAIL] Reset password para ${email}: ${url}`);
};
const enviarBienvenida = async (email, nombre) => {
  console.log(`[EMAIL] Bienvenida a ${nombre} <${email}>`);
};
module.exports = { enviarResetPassword, enviarBienvenida };