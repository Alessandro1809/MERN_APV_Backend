import Paciente from "../models/Paciente.js";

const agregarPaciente= async (req,res)=>{
const paciente= new Paciente(req.body);

try {
    paciente.veterinario=req.veterinario._id;
    const pacienteAlmacenado= await paciente.save();
    return res.json(pacienteAlmacenado)
} catch (error) {
    console.log(error);
}
};

const obtenerPaciente= async (req,res)=>{

    const pacientes= await Paciente.find()
                    .where('veterinario')
                    .equals(req.veterinario);
    return res.json(pacientes);

};

const obtenerUnPacienteEspecifico= async (req,res)=>{
     
    const id =req.params.id;
    const paciente= await Paciente.findById(id);
    
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    const error = new Error("accion no valida.");
    return res.json({error:error.message});
    };
    if (!paciente) {
        const error = new Error("Paciente no encontrado.");
        return res.status(404).json({error:error.message});
    }

      return res.json(paciente);  
     

};

const actualizarPaciente= async (req,res)=>{
    const id =req.params.id;
    const paciente= await Paciente.findById(id);
    
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    const error = new Error("accion no valida.");
    return res.json({error:error.message});
    };
    if (!paciente) {
        const error = new Error("Paciente no encontrado.");
        return res.status(404).json({error:error.message});
    }

    //actualiza los datos del paciente 
    paciente.nombre= req.body.nombre || paciente.nombre;
    paciente.propietario= req.body.propietario || paciente.propietario;
    paciente.email= req.body.email || paciente.email;
    paciente.fecha= req.body.fecha || paciente.fecha;
    paciente.sintomas= req.body.sintomas || paciente.sintomas;
   
    try {
        const pacienteActualizado = await paciente.save();
        return res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
    
};

const eliminarPaciente= async (req,res)=>{
    const id =req.params.id;
    const paciente= await Paciente.findById(id);
    
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    const error = new Error("accion no valida.");
    return res.json({error:error.message});
    };
    if (!paciente) {
        const error = new Error("Paciente no encontrado.");
        return res.status(404).json({error:error.message});
    }

    try {
        await paciente.deleteOne();
        return res.json({msg:"Paciente eliminado correctamente."})
    } catch (error) {
        console.log(error);
    }
};

export{
    agregarPaciente,
    obtenerPaciente,
    obtenerUnPacienteEspecifico,
    actualizarPaciente,
    eliminarPaciente
}