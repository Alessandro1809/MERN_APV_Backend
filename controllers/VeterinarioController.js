import Veterinario from '../models/Veterinario.js'
import generarJWT from '../helpers/generarJWT.js';
import generarID from '../helpers/GenerarId.js';
import emailRegistro from '../helpers/EmailRegistro.js';
import emailOlvidePassword from '../helpers/EmailOlvidePassword.js';

const registrar= async (req,res)=>{
    const {email,nombre}= req.body;
    //prevenir usuarios duplicados
    const existeUsuario= await Veterinario.findOne({email});
    
    if(existeUsuario){
        const error= new Error('Ups! Parece que este correo ya pertenece a otro usario!')
        return res.status(400).json({msg:error.message});
    }

    try {
        //Guardar nuevo veterinario...
        const veterinario= new Veterinario(req.body);
        const veterinarioGuardado= await veterinario.save();

            //Enviar el email 
        emailRegistro({email, nombre, token: veterinarioGuardado.token});


        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(`error en: ${error.message}`);
    }

}

const perfil=(req,res)=>{
    const {veterinario}= req;
    
    res.json(veterinario);
}

const confirmar = async (req, res) => {
    const { token } = req.params;
  
    const usuarioConfirmar = await Veterinario.findOne({ token });
  
    if (!usuarioConfirmar) {
      const error = new Error("Token no válido");
      return res.status(404).json({ msg: error.message });
    }
  
    try {
      usuarioConfirmar.token = null;
      usuarioConfirmar.confirmado = true;
      await usuarioConfirmar.save();

      res.json({ msg: "Usuario Confirmado Correctamente" });

    } catch (error) {
      console.log(error);
    }
  };

const autenticar = async(req,res)=>{
    const {email,password}=req.body;
    // comprueba que existe el usuario
    const usuario=await Veterinario.findOne({email});
    if (!usuario) {
        const error= new Error('Ups! Parece que este usuario no existe! Comprueba que los datos sean correctos.')
        return res.status(403).json({msg:error.message});
    }
    //comprueba que el usuario esta confirmado
    if (!usuario.confirmado) {
        const error= new Error('Ups! tu cuenta no ha sido confirmada.')
        return res.status(403).json({msg:error.message});
    }
    //comprueba el password
    if (await usuario.comprobarPassword(password)) {
        //autenticar JWT
        res.json({
        _id:usuario._id,
        nombre:usuario.nombre,
        email:usuario.email,
        token:generarJWT(usuario.id)
    });
    return;
    }else{
        const error= new Error('Password incorrecto.')
        return res.status(403).json({msg:error.message});
    }
    
    res.json({msg:"autenticado"});
}

const olvidePassword=async(req,res)=>{
    const {email}= req.body;

    const existeVeterinario= await Veterinario.findOne({email});

    if (!existeVeterinario) {
        const error= new Error("El usuario no existe");
        res.status(404).json({msg:error.message});
    }
    try {
        existeVeterinario.token= generarID();
        await existeVeterinario.save();

        //enviar email con instrucciones

        emailOlvidePassword({
            email,
            nombre:existeVeterinario.nombre,
            token:existeVeterinario.token
        });

        res.json({msg:"hemos enviado a tu correo un mensaje con las instruccioines para recuperar tu password."});

    } catch (error) {
        console.log(error);
    }
}
const nuevoPassword= async (req,res)=>{
    const {token}= req.params;
    const {password}= req.body;
    
    const veterinario= await Veterinario.findOne({token});
    if (!veterinario) {
        const error= new Error("parece que hubo un error!");
        return res.status(400).json({msg:error.message});
    }
    try {
        veterinario.token=null;
        veterinario.password=password;
        await veterinario.save();
        return res.json({msg:"El password se ha modificado exitosamente!"})
    } catch (error) {
        console.log(error);
    }

}
const comprobarToken=async (req,res)=>{
    const {token}=req.params;

    const tokenValido = await Veterinario.findOne({token});

    if (tokenValido) {
        //el token es valido el usuario existe
       return res.json({msg:"Token valido el usuario existe"});
    }else{
        const error = new Error("Token invalido");
        return res.status(403).json({msg:error.message});
    }

}

const actualizarPerfil= async (req,res)=>{
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
      const error = new Error("Hubo un error");
      return res.status(400).json({ msg: error.message });
    }
  
    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
      const existeEmail = await Veterinario.findOne({ email });
  
      if (existeEmail) {
        const error = new Error("Ese email ya esta en uso");
        return res.status(400).json({ msg: error.message });
      }
    }
  
    try {
      veterinario.nombre = req.body.nombre;
      veterinario.email = req.body.email;
      veterinario.web = req.body.web;
      veterinario.telefono = req.body.telefono;
  
      const veterianrioActualizado = await veterinario.save();
      res.json(veterianrioActualizado);
    } catch (error) {
      console.log(error);
    }

}

const actualizarPassword= async (req,res)=>{
//leer datos
const {id}= req.veterinario;
const {pwd_actual,pwd_nuevo}= req.body;
//comprobar que exista el veterinario
const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
      const error = new Error("Hubo un error");
      return res.status(400).json({ msg: error.message });
    }
// comprobar su password
if (await veterinario.comprobarPassword(pwd_actual)) {
    veterinario.password= pwd_nuevo;
    await veterinario.save();
    res.json({msg: 'Password almacenado correctamente'});
}else{
    const error = new Error("El password actual es incorrecto");
    return res.status(400).json({ msg: error.message });
}
//almacenar el password
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    nuevoPassword,
    comprobarToken,
    actualizarPerfil,
    actualizarPassword
}