import { UsuarioPedido, Usuario, Pedido } from "../models/index.js";

export const linkUsuarioPedido = async (req, res) => {
  try {
    const { id_usuario, id_pedido } = req.body;
    await UsuarioPedido.create({ id_usuario, id_pedido });
    res.status(201).json({ message: "Usuario asociado al pedido" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const unlinkUsuarioPedido = async (req, res) => {
  try {
    const { idUsuario, idPedido } = req.params;
    await UsuarioPedido.destroy({ where: { id_usuario: idUsuario, id_pedido: idPedido } });
    res.json({ message: "Usuario desasociado del pedido" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getPedidosDeUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.idUsuario, { include: [Pedido] });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario.Pedidos ?? []);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getUsuariosDePedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.idPedido, { include: [Usuario] });
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(pedido.Usuarios ?? []);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
