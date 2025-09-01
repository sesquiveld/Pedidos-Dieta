/*import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../controllers/usuarioController.js";
const router = Router();

router.get("/", listar);
router.get("/:id", obtener);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;
*/

import { Router } from "express";
import {
  createUsuario, getUsuarios, getUsuarioById, updateUsuario, deleteUsuario
} from "../controllers/usuarioController.js";

const router = Router();
router.post("/", createUsuario);
router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);
export default router;
