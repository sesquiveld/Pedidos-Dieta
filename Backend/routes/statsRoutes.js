// backend/routes/statsRoutes.js
import { Router } from "express";
import { Cliente, Area, Empaque, Usuario, Pedido } from "../models/index.js";

const statsRoutes = Router();

statsRoutes.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.count();
    const areas = await Area.count();
    const empaques = await Empaque.count();
    const usuarios = await Usuario.count();
    const pedidos = await Pedido.count();

    res.json({ clientes, areas, empaques, usuarios, pedidos });
  } catch (error) {
    console.error("Error en /api/stats:", error.message);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

export default statsRoutes;
