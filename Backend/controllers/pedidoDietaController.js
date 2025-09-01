import { PedidoDieta, Pedido, Dieta } from "../models/index.js";

export const addDietaToPedido = async (req, res) => {
  try {
    const { id_pedido, codigo_dieta, cantidad = 1 } = req.body;
    const x = await PedidoDieta.create({ id_pedido, codigo_dieta, cantidad });
    res.status(201).json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateCantidadDieta = async (req, res) => {
  try {
    const { idPedido, idDieta } = req.params;
    const { CANTIDAD } = req.body;
    const row = await PedidoDieta.findOne({ where: { id_pedido: idPedido, codigo_dieta: idDieta } });
    if (!row) return res.status(404).json({ error: "Relación Pedido-Dieta no encontrada" });
    await row.update({ CANTIDAD });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const removeDietaFromPedido = async (req, res) => {
  try {
    const { idPedido, idDieta } = req.params;
    await PedidoDieta.destroy({ where: { id_pedido: idPedido, codigo_dieta: idDieta } });
    res.json({ message: "Dieta eliminada del pedido" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getDietasDePedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.idPedido, { include: [Dieta] });
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(pedido.Dieta ? pedido.Dieta : pedido.Dietas ?? []);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
