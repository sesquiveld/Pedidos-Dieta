import { Router } from "express";
import {
  linkClienteArea, unlinkClienteArea, getAreasDeCliente, getClientesDeArea
} from "../controllers/clienteAreaController.js";

const router = Router();
router.post("/", linkClienteArea);
router.delete("/:idCliente/:idArea", unlinkClienteArea);
router.get("/cliente/:idCliente", getAreasDeCliente);
router.get("/area/:idArea", getClientesDeArea);
export default router;
