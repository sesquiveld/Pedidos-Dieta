import express from "express";
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