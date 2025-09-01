/*import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../controllers/empaqueController.js";
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
  createEmpaque, getEmpaques, getEmpaqueById, updateEmpaque, deleteEmpaque
} from "../controllers/empaqueController.js";

const router = Router();
router.post("/", createEmpaque);
router.get("/", getEmpaques);
router.get("/:id", getEmpaqueById);
router.put("/:id", updateEmpaque);
router.delete("/:id", deleteEmpaque);
export default router;