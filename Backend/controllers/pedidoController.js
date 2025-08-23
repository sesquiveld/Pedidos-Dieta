import { Pedido, Cliente, Area, Dieta, Empaque } from "../models/index.js";

export const createPedido = async (req, res) => {
  try {
    // body: { TIPO_COMIDA, CANTIDAD, FECHA, ID_CLIENTE, ID_AREA }
    const pedido = await Pedido.create(req.body);
    res.status(201).json(pedido);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getPedidos = async (_req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: Cliente, attributes: ["ID_CLIENTE", "NOMBRE"] },
        { model: Area, attributes: ["ID_AREA", "NOMBRE_AREA"] },
        { model: Dieta, through: { attributes: ["CANTIDAD"] } },
        { model: Empaque, through: { attributes: [] } },
      ],
    });
    res.json(pedidos);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getPedidoById = async (req, res) => {
  try {
    const x = await Pedido.findByPk(req.params.id, {
      include: [
        { model: Cliente, attributes: ["ID_CLIENTE", "NOMBRE"] },
        { model: Area, attributes: ["ID_AREA", "NOMBRE_AREA"] },
        { model: Dieta, through: { attributes: ["CANTIDAD"] } },
        { model: Empaque, through: { attributes: [] } },
      ],
    });
    if (!x) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updatePedido = async (req, res) => {
  try {
    const x = await Pedido.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Pedido no encontrado" });
    await x.update(req.body);
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deletePedido = async (req, res) => {
  try {
    const x = await Pedido.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Pedido no encontrado" });
    await x.destroy();
    res.json({ message: "Pedido eliminado" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
