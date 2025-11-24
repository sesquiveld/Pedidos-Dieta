import { Router } from "express";
import {
  addDietaToPedido,
  updateCantidadDieta,
  removeDietaFromPedido,
  getDietasDePedido
} from "../controllers/pedidoDietaController.js";

const router = Router();
router.post("/", addDietaToPedido);
router.put("/:idPedido/:idDieta", updateCantidadDieta);
router.delete("/:idPedido/:idDieta", removeDietaFromPedido);
router.get("/:idPedido", getDietasDePedido);

export default router;


