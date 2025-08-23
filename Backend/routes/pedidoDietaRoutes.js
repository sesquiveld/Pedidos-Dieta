import { Router } from "express";
import {
  addDietaToPedido, updateCantidadDieta, removeDietaFromPedido, getDietasDePedido
} from "../controllers/pedidoDietaController.js";

const router = Router();
router.post("/", addDietaToPedido); // body: {ID_PEDIDO, CODIGO_DIETA, CANTIDAD}
router.put("/:idPedido/:idDieta", updateCantidadDieta);
router.delete("/:idPedido/:idDieta", removeDietaFromPedido);
router.get("/pedido/:idPedido", getDietasDePedido);
export default router;
