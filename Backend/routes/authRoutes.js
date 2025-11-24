
// routes/authRoutes.js
import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// 🔓 Rutas públicas
router.post("/login", login);      // Iniciar sesión
router.post("/register", register); // Registrar usuario (opcional)

export default router;
