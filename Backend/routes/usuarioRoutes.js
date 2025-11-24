
import express from "express";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuarioController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas protegidas
router.get("/", authMiddleware, getUsuarios);
router.post("/", authMiddleware, createUsuario);
router.put("/:id_usuario", authMiddleware, updateUsuario);
router.delete("/:id_usuario", authMiddleware, deleteUsuario);

export default router;