
// areaController.js
import Area from "../models/areaModels.js"; 



// Obtener todas las áreas
export const getAreas = async (req, res) => {
  try {
    const areas = await Area.findAll();
    res.json(areas);
  } catch (error) {
    console.error("Error obteniendo áreas:", error);
    res.status(500).json({ error: "Error al obtener las áreas" });
  }
};

// Crear nueva área
export const createArea = async (req, res) => {
  try {
    const { id_area, nombre_area, descripcion, ubicacion } = req.body;

    // Validación básica
    if (!id_area || isNaN(Number(id_area))) {
      return res.status(400).json({ error: "El campo id_area es obligatorio y debe ser numérico" });
    }
    if (!nombre_area || nombre_area.trim() === "") {
      return res.status(400).json({ error: "El campo nombre es obligatorio" });
    }

    const area = await Area.create({
      id_area: Number(id_area),
      nombre_area,
      descripcion: descripcion || null,
      ubicacion: ubicacion || null,
    });

    res.status(201).json(area);
  } catch (error) {
    console.error("Error creando área:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getAreaById = async (req, res) => {
  try {
    const x = await Area.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Área no encontrada" });
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};


// Actualizar área
export const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_area, descripcion, ubicacion } = req.body;

    const area = await Area.findByPk(id);
    if (!area) {
      return res.status(404).json({ error: "Área no encontrada" });
    }

    await area.update({
      nombre_area: nombre_area ?? area.nombre_area,
      descripcion: descripcion ?? area.descripcion,
      ubicacion: ubicacion ?? area.ubicacion,
    });

    res.json(area);
  } catch (error) {
    console.error("Error actualizando área:", error);
    res.status(400).json({ error: error.message });
  }
};

// Eliminar área
export const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await Area.findByPk(id);
    if (!area) {
      return res.status(404).json({ error: "Área no encontrada" });
    }
    await area.destroy();
    res.json({ message: "Área eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando área:", error);
    res.status(400).json({ error: error.message });
  }
};


