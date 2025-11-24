// dietaController.js
import Dieta from "../models/dietaModels.js"; 


// Obtener todas las dietas
export const getDietas = async (req, res) => {
  try {
    const dietas = await Dieta.findAll();
    res.json(dietas);
  } catch (error) {
    console.error("Error obteniendo dietas:", error);
    res.status(500).json({ error: "Error al obtener las dietas" });
  }
};

// Crear nueva dieta
export const createDieta = async (req, res) => {
  try {
    const { codigo_dieta, nombre_dieta } = req.body;

    if (!codigo_dieta || codigo_dieta.trim() === "") {
      return res.status(400).json({ error: "El campo codigo_dieta es obligatorio" });
    }
    if (!nombre_dieta || nombre_dieta.trim() === "") {
      return res.status(400).json({ error: "El campo nombre es obligatorio" });
    }

    const dieta = await Dieta.create({
      codigo_dieta,
      nombre_dieta,
    });

    res.status(201).json(dieta);
  } catch (error) {
    console.error("Error creando dieta:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getDietaById = async (req, res) => {
  try {
    const x = await Dieta.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Dieta no encontrada" });
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// Actualizar dieta
export const updateDieta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_dieta } = req.body;

    const dieta = await Dieta.findByPk(id);
    if (!dieta) {
      return res.status(404).json({ error: "Dieta no encontrada" });
    }

    await dieta.update({
      nombre_dieta: nombre_dieta ?? dieta.nombre_dieta,
    });

    res.json(dieta);
  } catch (error) {
    console.error("Error actualizando dieta:", error);
    res.status(400).json({ error: error.message });
  }
};

// Eliminar dieta
export const deleteDieta = async (req, res) => {
  try {
    const { id } = req.params;
    const dieta = await Dieta.findByPk(id);
    if (!dieta) {
      return res.status(404).json({ error: "Dieta no encontrada" });
    }
    await dieta.destroy();
    res.json({ message: "Dieta eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando dieta:", error);
    res.status(400).json({ error: error.message });
  }
};



