// controllers/pedidoEmpaqueController.js
import { PedidoEmpaque, Pedido, Empaque } from "../models/index.js";

// Agregar empaque a un pedido
export const addEmpaqueToPedido = async (req, res) => {
  try {
    const { id_pedido, id_empaque, cantidad = 1 } = req.body;

    if (!id_pedido || isNaN(Number(id_pedido))) {
      return res.status(400).json({ error: "El campo id_pedido es obligatorio y debe ser numérico" });
    }
    if (!id_empaque) {
      return res.status(400).json({ error: "El campo id_empaque es obligatorio" });
    }
    if (isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      return res.status(400).json({ error: "El campo cantidad debe ser un número positivo" });
    }

    const x = await PedidoEmpaque.create({
      id_pedido: Number(id_pedido),
      id_empaque: Number(id_empaque),
      cantidad: Number(cantidad),
    });

    res.status(201).json(x);
  } catch (error) {
    console.error("Error agregando empaque al pedido:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar empaque de un pedido
export const removeEmpaqueFromPedido = async (req, res) => {
  try {
    const { idPedido, idEmpaque } = req.params;
    await PedidoEmpaque.destroy({
      where: { id_pedido: idPedido, id_empaque: idEmpaque },
    });
    res.json({ message: "Empaque eliminado del pedido" });
  } catch (error) {
    console.error("Error eliminando empaque:", error);
    res.status(500).json({ error: error.message });
  }
};

// Listar empaques de un pedido
export const getEmpaquesDePedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.idPedido, {
      include: [Empaque],
    });

    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

    res.json(pedido.Empaques ?? []);
  } catch (error) {
    console.error("Error obteniendo empaques de pedido:", error);
    res.status(500).json({ error: error.message });
  }
};


// controllers/pedidoEmpaqueController.js
import { PedidoEmpaque, Empaque } from "../models/index.js";

// Obtener empaques de un pedido
export const getEmpaquesPorPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const empaques = await PedidoEmpaque.findAll({
      where: { id_pedido },
      include: [{ model: Empaque, attributes: ["id_empaque", "nombre_empaque", "precio_empaque"] }],
    });
    res.json(empaques);
  } catch (err) {
    console.error("Error en getEmpaquesPorPedido:", err);
    res.status(500).json({ error: err.message });
  }
};

// Crear empaques asociados a un pedido
export const addEmpaquesToPedido = async (req, res) => {
  try {
    const { id_pedido, empaques } = req.body;
    if (!Array.isArray(empaques)) return res.status(400).json({ error: "Empaques inválidos" });

    const registros = empaques.map((e) => ({
      id_pedido,
      id_empaque: e.id_empaque,
      cantidad: Number(e.cantidad || 1),
    }));

    await PedidoEmpaque.bulkCreate(registros);
    res.json({ message: "Empaques agregados correctamente" });
  } catch (err) {
    console.error("Error en addEmpaquesToPedido:", err);
    res.status(500).json({ error: err.message });
  }
};
