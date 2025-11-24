// empaqueController.js
import Empaque from "../models/empaqueModels.js";

// Obtener todos los empaques
export const getEmpaques = async (req, res) => {
  try {
    const empaques = await Empaque.findAll();
    res.json(empaques);
  } catch (error) {
    console.error("Error obteniendo empaques:", error);
    res.status(500).json({ error: "Error al obtener los empaques" });
  }
};

// Crear nuevo empaque
export const createEmpaque = async (req, res) => {
  try {
    const { id_empaque, nombre_empaque, caracteristicas, precio_empaque } = req.body;

    // Validaciones

    if (!id_empaque || isNaN(Number(id_empaque))) {
      return res.status(400).json({ error: "El campo id_empaque es obligatorio y debe ser numérico" });
    }
    if (!nombre_empaque || nombre_empaque.trim() === "") {
      return res.status(400).json({ error: "El campo nombre_empaque es obligatorio" });
    }
    if (!caracteristicas || caracteristicas.trim() === "") {
      return res.status(400).json({ error: "El campo caracteristicas es obligatorio" });
    }
    if (precio_empaque == null || isNaN(Number(precio_empaque))) {
      return res.status(400).json({ error: "El campo precio_empaque es obligatorio y debe ser numérico" });
    }
 
    const empaque = await Empaque.create({
      id_empaque: Number(id_empaque),
      nombre_empaque,
      precio_empaque: precio_empaque || null,
      caracteristicas: caracteristicas || null,
    });
    
    res.status(201).json(empaque);
  } catch (error) {
    console.error("Error creando empaque:", error);
    res.status(400).json({ error: error.message });
  }
};

// Obtener empaque por ID
export const getEmpaqueById = async (req, res) => {
  try {
    const empaque = await Empaque.findByPk(req.params.id);
    if (!empaque) {
      return res.status(404).json({ error: "Empaque no encontrado" });
    }
    res.json(empaque);
  } catch (error) {
    console.error("Error obteniendo empaque:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar empaque
export const updateEmpaque = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_empaque, caracteristicas, precio_empaque } = req.body;

    const empaque = await Empaque.findByPk(id);
    if (!empaque) {
      return res.status(404).json({ error: "Empaque no encontrado" });
    }

    await empaque.update({
      nombre_empaque: nombre_empaque ?? empaque.nombre_empaque,
      caracteristicas: caracteristicas ?? empaque.caracteristicas,
      precio_empaque: precio_empaque != null ? Number(precio_empaque) : empaque.precio_empaque,
    });

    res.json(empaque);
  } catch (error) {
    console.error("Error actualizando empaque:", error);
    res.status(400).json({ error: error.message });
  }
};

// Eliminar empaque
export const deleteEmpaque = async (req, res) => {
  try {
    const { id } = req.params;
    const empaque = await Empaque.findByPk(id);
    if (!empaque) {
      return res.status(404).json({ error: "Empaque no encontrado" });
    }
    await empaque.destroy();
    res.json({ message: "Empaque eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando empaque:", error);
    res.status(400).json({ error: error.message });
  }
};





