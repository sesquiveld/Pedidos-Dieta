// backend/routes/clienteDietaRoutes.js
import express from "express";
import {
  getClienteDietas,
  createClienteDieta,
  updateClienteDieta,
  deleteClienteDieta,
} from "../controllers/clienteDietaController.js";

const router = express.Router();

router.get("/", getClienteDietas);
router.post("/", createClienteDieta);
router.put("/:id_cliente/:codigo_dieta", updateClienteDieta);
router.delete("/:id_cliente/:codigo_dieta", deleteClienteDieta);

export default router;

