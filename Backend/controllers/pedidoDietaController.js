// pedidoDietaController.js
import { PedidoDieta, Pedido, Dieta } from "../models/index.js";

// Agregar dieta a un pedido
export const addDietaToPedido = async (req, res) => {
  try {
    const { id_pedido, codigo_dieta, cantidad = 1 } = req.body;

    if (!id_pedido || isNaN(Number(id_pedido))) {
      return res.status(400).json({ error: "El campo id_pedido es obligatorio y debe ser numérico" });
    }
    if (!codigo_dieta || codigo_dieta.trim() === "") {
      return res.status(400).json({ error: "El campo codigo_dieta es obligatorio" });
    }
    if (isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      return res.status(400).json({ error: "El campo cantidad debe ser un número positivo" });
    }

    const x = await PedidoDieta.create({
      id_pedido: Number(id_pedido),
      codigo_dieta,
      cantidad: Number(cantidad),
    });

    res.status(201).json(x);
  } catch (error) {
    console.error("Error agregando dieta al pedido:", error);
    res.status(400).json({ error: error.message });
  }
};

// Actualizar cantidad de una dieta en un pedido
export const updateCantidadDieta = async (req, res) => {
  try {
    const { idPedido, idDieta } = req.params;
    const { cantidad } = req.body;

    if (isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      return res.status(400).json({ error: "El campo cantidad debe ser un número positivo" });
    }

    const row = await PedidoDieta.findOne({
      where: { id_pedido: idPedido, codigo_dieta: idDieta },
    });

    if (!row) {
      return res.status(404).json({ error: "Relación Pedido-Dieta no encontrada" });
    }

    await row.update({ cantidad: Number(cantidad) });
    res.json(row);
  } catch (error) {
    console.error("Error actualizando cantidad:", error);
    res.status(400).json({ error: error.message });
  }
};

// Eliminar dieta de un pedido
export const removeDietaFromPedido = async (req, res) => {
  try {
    const { idPedido, idDieta } = req.params;

    const deleted = await PedidoDieta.destroy({
      where: { id_pedido: idPedido, codigo_dieta: idDieta },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Relación Pedido-Dieta no encontrada" });
    }

    res.json({ message: "Dieta eliminada del pedido" });
  } catch (error) {
    console.error("Error eliminando dieta del pedido:", error);
    res.status(400).json({ error: error.message });
  }
};

// Listar todas las dietas de un pedido
export const getDietasDePedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.idPedido, {
      include: [Dieta],
    });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Sequelize puede devolver Dieta o Dietas según asociación
    res.json(pedido.Dietas ?? pedido.Dieta ?? []);
  } catch (error) {
    console.error("Error obteniendo dietas de pedido:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las dietas asociadas a un pedido
export const getDietasPorPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const dietas = await PedidoDieta.findAll({
      where: { id_pedido },
      include: [{ model: Dieta, attributes: ["codigo_dieta", "nombre_dieta", "precio"] }],
    });
    res.json(dietas);
  } catch (err) {
    console.error("Error en getDietasPorPedido:", err);
    res.status(500).json({ error: err.message });
  }
};

// Crear dietas asociadas a un pedido
export const addDietasToPedido = async (req, res) => {
  try {
    const { id_pedido, dietas } = req.body;
    if (!Array.isArray(dietas)) return res.status(400).json({ error: "Dietas inválidas" });

    const registros = dietas.map((d) => ({
      id_pedido,
      codigo_dieta: d.codigo_dieta,
      cantidad: Number(d.cantidad || 1),
    }));

    await PedidoDieta.bulkCreate(registros);
    res.json({ message: "Dietas agregadas correctamente" });
  } catch (err) {
    console.error("Error en addDietasToPedido:", err);
    res.status(500).json({ error: err.message });
  }
};

