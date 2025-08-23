import { Router } from "express";
import {
  linkUsuarioPedido, unlinkUsuarioPedido, getPedidosDeUsuario, getUsuariosDePedido
} from "../controllers/usuarioPedidoController.js";

const router = Router();
router.post("/", linkUsuarioPedido); // body: {ID_USUARIO, ID_PEDIDO}
router.delete("/:idUsuario/:idPedido", unlinkUsuarioPedido);
router.get("/usuario/:idUsuario", getPedidosDeUsuario);
router.get("/pedido/:idPedido", getUsuariosDePedido);
export default router;
