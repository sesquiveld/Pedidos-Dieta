import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Usuario from "../models/usuarioModels.js";

// 🔓 Login
export const login = async (req, res) => {
  try {
    const { id_usuario, contrasena } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { id_usuario } });
    if (!usuario) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!validPassword) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Crear token
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        tipo_usuario: usuario.tipo_usuario,
      },
      process.env.JWT_SECRET, // 👈 clave correcta
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre_usuario,
        tipo_usuario: usuario.tipo_usuario,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno en login" });
  }
};

// 🔓 Registro de usuarios
export const register = async (req, res) => {
  try {
    const { id_usuario, nombre_usuario, correo_usuario, contrasena, tipo_usuario } = req.body;

    // Validar que no exista el usuario
    const existe = await Usuario.findOne({ where: { id_usuario } });
    if (existe) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      id_usuario,
      nombre_usuario,
      correo_usuario,
      contrasena: hashedPassword,
      tipo_usuario,
      ACTIVO: true,
    });

    res.status(201).json({ msg: "Usuario registrado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno en registro" });
  }
};

