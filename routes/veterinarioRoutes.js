import express from "express";
import { registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
    comprobarToken} from "../controllers/VeterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router =express.Router();
//area publica
router.post('/',registrar);
router.get('/confirmar/:token',confirmar);
router.post('/login',autenticar);
router.post('/olvide-password',olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)
//area privada
router.get('/perfil',checkAuth,perfil);
router.put('/perfil/:id',checkAuth, actualizarPerfil);
router.put('/actualizarPassword',checkAuth, actualizarPassword);

export default router;