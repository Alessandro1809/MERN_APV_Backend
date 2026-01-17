import emailjs from '@emailjs/nodejs';

const sendEmail = async (templateId, templateParams) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !publicKey || !privateKey || !templateId) {
    throw new Error('Missing EmailJS configuration');
  }

  return emailjs.send(serviceId, templateId, templateParams, {
    publicKey,
    privateKey,
  });
};

export default sendEmail;
