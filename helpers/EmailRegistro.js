import { text } from 'express';
import nodemailer from 'nodemailer';

const emailRegistro= async (datos)=>{
    
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
        subject:"Confirma tu cuenta en APV para finalizar tu registro",
        text:'Confirma tu cuenta en APV para finalizar tu registro',
        html: `<p>Hola ${nombre}, confirma tu cuenta en APV.</p>
                <p>Tu cuenta ya esta lista, solo tienes que comprobar que eres tu en el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/confirmarcuenta/${token}"> Confirmar cuenta </a></p>
                
                <p>Si tu no creaste esta cuenta puedes ignorar este mensaje.</p>`
      });
      console.log("Mensaje enviado: %s", infoCorreo.messageId)
}

export default emailRegistro;