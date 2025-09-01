/*import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../controllers/pedidoController.js";
const router = Router();

router.get("/", listar);
router.get("/:id", obtener);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;


import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../controllers/pedidoController.js";
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
  createPedido, getPedidos, getPedidoById, updatePedido, deletePedido
} from "../controllers/pedidoController.js";

const router = Router();
router.post("/", createPedido);
router.get("/", getPedidos);
router.get("/:id", getPedidoById);
router.put("/:id", updatePedido);
router.delete("/:id", deletePedido);
export default router;
