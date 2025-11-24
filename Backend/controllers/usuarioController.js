import bcrypt from "bcryptjs";
import Usuario from "../models/usuarioModels.js";

// ====================== CRUD ======================

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["contrasena"] }, // no mostrar la contraseña
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un usuario nuevo
export const createUsuario = async (req, res) => {
  try {
    const { id_usuario, nombre_usuario, correo_usuario, contrasena, tipo_usuario, ACTIVO } = req.body;

    // Validaciones mínimas
    if (!id_usuario || !nombre_usuario || !correo_usuario || !contrasena || !tipo_usuario) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = await Usuario.create({
      id_usuario,
      nombre_usuario,
      correo_usuario,
      contrasena: hashedPassword,
      tipo_usuario,
      ACTIVO: ACTIVO ?? true,
    });

    res.status(201).json({
      id_usuario: nuevoUsuario.id_usuario,
      nombre_usuario: nuevoUsuario.nombre_usuario,
      correo_usuario: nuevoUsuario.correo_usuario,
      tipo_usuario: nuevoUsuario.tipo_usuario,
      ACTIVO: nuevoUsuario.ACTIVO,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, correo_usuario, contrasena, tipo_usuario, ACTIVO } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    let newPassword = usuario.contrasena;
    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(contrasena, salt);
    }

    await usuario.update({
      nombre_usuario: nombre_usuario ?? usuario.nombre_usuario,
      correo_usuario: correo_usuario ?? usuario.correo_usuario,
      contrasena: newPassword,
      tipo_usuario: tipo_usuario ?? usuario.tipo_usuario,
      ACTIVO: ACTIVO ?? usuario.ACTIVO,
    });

    res.json({
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      correo_usuario: usuario.correo_usuario,
      tipo_usuario: usuario.tipo_usuario,
      ACTIVO: usuario.ACTIVO,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    await usuario.destroy();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



