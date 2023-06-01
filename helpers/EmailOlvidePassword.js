import { text } from 'express';
import nodemailer from 'nodemailer';

const emailOlvidePassword= async (datos)=>{
    
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      const {email, nombre, token }= datos;

      //Enviar email

      const infoCorreo= await transporter.sendMail({
        from:"APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject:"Reestablece tu password",
        text:'Reestablece tu password',
        html: `<p>Hola ${nombre}, haz solicitdo el reestablecimiento de password de APV.</p>
                <p>Da click al siguiente enlace para generar un nuevo password: 
                <a href="${process.env.FRONTEND_URL}/olvidepassword/${token}"> Reestablecer password </a></p>
                
                <p>Si tu no creaste esta cuenta puedes ignorar este mensaje.</p>`
      });
      console.log("Mensaje enviado: %s", infoCorreo.messageId)
}

export default emailOlvidePassword;