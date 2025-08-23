import { Router } from "express";
import {
  createPedido, getPedidos, getPedidoById, updatePedido, deletePedido
} from "../controllers/pedidoController.js";

const router = Router();
router.post("/", createPedido);
router.get("/", getPedidos);
router.get("/:id", getPedidoById);
router.put("/:id", updatePedido);
router.delete("/:id", deletePedido);
export default router;
