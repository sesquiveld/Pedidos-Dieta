/*import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../controllers/dietaController.js";
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
  createDieta, getDietas, getDietaById, updateDieta, deleteDieta
} from "../controllers/dietaController.js";

const router = Router();
router.post("/", createDieta);
router.get("/", getDietas);
router.get("/:id", getDietaById);
router.put("/:id", updateDieta);
router.delete("/:id", deleteDieta);
export default router;
