import sendEmail from './emailClient.js';

const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;
  const confirmUrl = `${process.env.FRONTEND_URL}/confirmarcuenta/${token}`;

  const templateParams = {
    to_email: email,
    to_name: nombre,
    confirm_url: confirmUrl,
    from_name:
      process.env.EMAILJS_FROM_NAME ||
      'APV - Administrador de Pacientes de Veterinaria',
  };

  const result = await sendEmail(
    process.env.EMAILJS_TEMPLATE_REGISTRO_ID,
    templateParams
  );

  console.log('Email enviado: %s', result.status);
};

export default emailRegistro;
