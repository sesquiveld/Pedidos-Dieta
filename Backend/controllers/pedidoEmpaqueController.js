import { PedidoEmpaque, Pedido, Empaque } from "../models/index.js";

export const addEmpaqueToPedido = async (req, res) => {
  try {
    const { ID_PEDIDO, ID_EMPAQUE } = req.body;
    const x = await PedidoEmpaque.create({ id_pedido, id_empaque });
    res.status(201).json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const removeEmpaqueFromPedido = async (req, res) => {
  try {
    const { idPedido, idEmpaque } = req.params;
    await PedidoEmpaque.destroy({ where: { id_pedido: idPedido, id_empaque: idEmpaque } });
    res.json({ message: "Empaque eliminado del pedido" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getEmpaquesDePedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.idPedido, { include: [Empaque] });
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(pedido.Empaques ?? []);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
