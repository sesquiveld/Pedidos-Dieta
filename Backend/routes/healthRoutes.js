// backend/routes/healthRoutes.js
import { Router } from "express";
import sequelize from "../config/db.js";

const healthRoutes = Router();

healthRoutes.get("/", async (req, res) => {
  try {
    await sequelize.authenticate(); // prueba conexión con DB
    res.json({ status: "ok", message: "Base de datos conectada ✅" });
  } catch (error) {
    console.error("Error en /api/health:", error.message);
    res.status(500).json({ status: "error", message: "No hay conexión a la base de datos ❌" });
  }
});

export default healthRoutes;
