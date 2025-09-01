import { Router } from "express";
import {
  addDietaToCliente, removeDietaFromCliente, getDietaDeCliente
} from "../controllers/clienteDietaController.js";

const router = Router();
router.post("/", addDietaToCliente); // body: {ID_PEDIDO, ID_EMPAQUE}
router.delete("/:coddieta/:idcliente", removeDietaFromCliente);
router.get("/dieta/:coddieta", getDietaDeCliente);
export default router;
