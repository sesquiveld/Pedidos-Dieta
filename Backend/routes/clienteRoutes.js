// routes/clienteRoutes.js
import express from "express";
import {
  createCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
} from "../controllers/clienteController.js";

const router = express.Router();

router.post("/", createCliente);
router.get("/", getClientes);
router.get("/:id", getClienteById);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;
