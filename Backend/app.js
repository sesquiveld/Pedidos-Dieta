// backend/index.js
import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";

import clienteRoutes from "./routes/clienteRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
import dietaRoutes from "./routes/dietaRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import empaqueRoutes from "./routes/empaqueRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

import clienteAreaRoutes from "./routes/clienteAreaRoutes.js";
import pedidoDietaRoutes from "./routes/pedidoDietaRoutes.js";
import pedidoEmpaqueRoutes from "./routes/pedidoEmpaqueRoutes.js";
import usuarioPedidoRoutes from "./routes/usuarioPedidoRoutes.js";

import reportesRoutes from "./routes/reportesRoutes.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Vite por defecto

// Rutas
app.use("/clientes", clienteRoutes);
app.use("/areas", areaRoutes);
app.use("/dietas", dietaRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/empaques", empaqueRoutes);
app.use("/usuarios", usuarioRoutes);

app.use("/cliente-areas", clienteAreaRoutes);
app.use("/pedido-dietas", pedidoDietaRoutes);
app.use("/pedido-empaques", pedidoEmpaqueRoutes);
app.use("/usuario-pedidos", usuarioPedidoRoutes);

app.use("/api/reportes", reportesRoutes);

// Probar conexión con MySQL
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida.");

    // Sincronizar modelos con la BD
    await sequelize.sync({ alter: true }); 
    console.log("📦 Modelos sincronizados con la base de datos.");

    // Iniciar servidor
    const PORT = 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a la BD:", error);
  }
})();

