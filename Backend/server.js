// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.js"; 

// Importar rutas
import clienteRoutes from "./routes/clienteRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
import dietaRoutes from "./routes/dietaRoutes.js";
import empaqueRoutes from "./routes/empaqueRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import clienteDietaRoutes from "./routes/clienteDietaRoutes.js";

import { authMiddleware } from "./middleware/authMiddleware.js";


dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔓 Rutas públicas (sin token)
//app.use("/api/auth", authRoutes); // 👈 todas las rutas de login/registro
app.use("/api/auth", authRoutes);   // 👈 login, registro, etc.
app.use("/api/health", healthRoutes);
app.use("/api/stats", statsRoutes);    // estadísticas públicas 

// 🔒 Rutas protegidas (requieren token)
app.use("/api/clientes", authMiddleware, clienteRoutes);
app.use("/api/areas", authMiddleware, areaRoutes);
app.use("/api/dietas", authMiddleware, dietaRoutes);
app.use("/api/empaques", authMiddleware, empaqueRoutes);
app.use("/api/usuarios", authMiddleware, usuarioRoutes);
app.use("/api/pedidos", authMiddleware, pedidoRoutes);
app.use("/api/stats", authMiddleware, statsRoutes);
app.use("/api/cliente-dietas", authMiddleware, clienteDietaRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
sequelize.sync().then(() => {
  console.log("✅ Modelos sincronizados");
  app.listen(PORT, () =>
    console.log(`🚀 API en http://localhost:${PORT}`)
  );
});
