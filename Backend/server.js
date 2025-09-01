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

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Registrar rutas
app.use("/api/clientes", clienteRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/dietas", dietaRoutes);
app.use("/api/empaques", empaqueRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/stats", statsRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
sequelize.sync().then(() => {
  console.log("✅ Modelos sincronizados");
  app.listen(PORT, () =>
    console.log(`🚀 API en http://localhost:${PORT}`)
  );
});



/*import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // Vite por defecto
app.use(express.json());

app.use("/api", routes);

// Inicializar DB
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL OK");
    await sequelize.sync({ alter: true });
    console.log("✅ Modelos sincronizados");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 API en http://localhost:${PORT}`));
  } catch (e) {
    console.error("❌ Error iniciando DB:", e.message);
    process.exit(1);
  }
})();

*/

/*import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import routes from "./routes/index.js"; // agrupador de rutas

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes); // todas las rutas comienzan con /api

// Conectar a DB
sequelize
  .authenticate()
  .then(() => console.log("✅ Conexión a MySQL exitosa"))
  .catch((err) => console.error("❌ Error de conexión:", err));

// Levantar servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
*/




/*
import express from "express";
import cors from "cors";
import pool from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/api/pedidos", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.ID_PEDIDO, c.NOMBRE AS Cliente, a.NOMBRE_AREA, d.NOMBRE_DIETA,
             p.TIPO_COMIDA, p.CANTIDAD, p.FECHA
      FROM Pedido p
      JOIN Clientes c ON p.ID_CLIENTE = c.ID_CLIENTE
      JOIN Area a ON p.ID_AREA = a.ID_AREA
      JOIN Dieta d ON p.CODIGO_DIETA = d.CODIGO_DIETA
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/