// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // 🔹 Leer token desde Authorization: Bearer <token>
  let token = null;
  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 🔹 Si no vino en Authorization, revisar x-auth-token
  if (!token) {
    token = req.header("x-auth-token");
  }

  // 🔹 Si no hay token, denegar
  if (!token) {
    return res.status(401).json({ msg: "No hay token, permiso no válido" });
  }

  try {
    // Verificar token con tu secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // aquí tienes los datos del usuario
    next();
  } catch (err) {
    console.error("❌ Error verificando token:", err.message);
    res.status(401).json({ msg: "Token no válido" });
  }
};

