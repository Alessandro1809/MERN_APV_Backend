import express from "express";
const router = express.Router();
import { obtenerPaciente,
        agregarPaciente,
        actualizarPaciente,
        eliminarPaciente,
        obtenerUnPacienteEspecifico } from "../controllers/PacienteController.js";
import checkAuth from "../middleware/authMiddleware.js"

router.
    route('/')
    .post(checkAuth, agregarPaciente)
    .get(checkAuth, obtenerPaciente);

router.route('/:id')
        .get(checkAuth, obtenerUnPacienteEspecifico)
        .put(checkAuth, actualizarPaciente)
        .delete(checkAuth, eliminarPaciente);

export default router;