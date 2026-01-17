import sendEmail from './emailClient.js';

const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;
  const resetUrl = `${process.env.FRONTEND_URL}/olvidepassword/${token}`;

  const templateParams = {
    to_email: email,
    to_name: nombre,
    reset_url: resetUrl,
    from_name:
      process.env.EMAILJS_FROM_NAME ||
      'APV - Administrador de Pacientes de Veterinaria',
  };

  const result = await sendEmail(
    process.env.EMAILJS_TEMPLATE_OLVIDE_ID,
    templateParams
  );

  console.log('Email enviado: %s', result.status);
};

export default emailOlvidePassword;
