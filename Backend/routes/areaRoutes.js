/*import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../controllers/areaController.js";
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
  createArea, getAreas, getAreaById, updateArea, deleteArea
} from "../controllers/areaController.js";

const router = Router();
router.post("/", createArea);
router.get("/", getAreas);
router.get("/:id", getAreaById);
router.put("/:id", updateArea);
router.delete("/:id", deleteArea);
export default router;
