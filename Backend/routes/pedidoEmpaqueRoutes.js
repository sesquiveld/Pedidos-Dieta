import { Router } from "express";
import {
  addEmpaqueToPedido, removeEmpaqueFromPedido, getEmpaquesDePedido
} from "../controllers/pedidoEmpaqueController.js";

const router = Router();
router.post("/", addEmpaqueToPedido); // body: {ID_PEDIDO, ID_EMPAQUE}
router.delete("/:idPedido/:idEmpaque", removeEmpaqueFromPedido);
router.get("/pedido/:idPedido", getEmpaquesDePedido);
export default router;
