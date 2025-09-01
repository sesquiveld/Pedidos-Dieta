/*
import {
  Pedido, Cliente, Area, Dieta, Empaque,
  PedidoDieta, PedidoEmpaque, Usuario
} from "../models/index.js";

export const listar = async (_, res) => {
  const pedidos = await Pedido.findAll({
    include: [
      { model: Cliente },
      { model: Area },
      { model: Dieta, through: { attributes: ["CANTIDAD"] } },
      { model: Empaque, through: { attributes: ["CANTIDAD"] } },
      { model: Usuario, through: { attributes: [] } },
    ],
    order: [["FECHA", "DESC"], ["ID_PEDIDO", "DESC"]],
  });
  res.json(pedidos);
};

export const obtener = async (req, res) => {
  const p = await Pedido.findByPk(req.params.id, {
    include: [
      { model: Cliente },
      { model: Area },
      { model: Dieta, through: { attributes: ["CANTIDAD"] } },
      { model: Empaque, through: { attributes: ["CANTIDAD"] } },
      { model: Usuario, through: { attributes: [] } },
    ],
  });
  if (!p) return res.status(404).json({ error: "Pedido no encontrado" });
  res.json(p);
};

export const crear = async (req, res) => {
  try {
    const { ID_CLIENTE, ID_AREA, TIPO_COMIDA, FECHA, OBSERVACIONES,
            dietas = [], empaques = [], usuarios = [] } = req.body;

    const pedido = await Pedido.create({ ID_CLIENTE, ID_AREA, TIPO_COMIDA, FECHA, OBSERVACIONES });

    // dietas: [{ CODIGO_DIETA, CANTIDAD }]
    for (const d of dietas) {
      await PedidoDieta.create({
        ID_PEDIDO: pedido.ID_PEDIDO,
        CODIGO_DIETA: d.CODIGO_DIETA,
        CANTIDAD: d.CANTIDAD ?? 1,
      });
    }

    // empaques: [{ ID_EMPAQUE, CANTIDAD }]
    for (const e of empaques) {
      await PedidoEmpaque.create({
        ID_PEDIDO: pedido.ID_PEDIDO,
        ID_EMPAQUE: e.ID_EMPAQUE,
        CANTIDAD: e.CANTIDAD ?? 1,
      });
    }

    // usuarios: [ID_USUARIO]
    for (const u of usuarios) {
      await pedido.addUsuario(u);
    }

    const creado = await Pedido.findByPk(pedido.ID_PEDIDO, {
      include: [
        { model: Cliente }, { model: Area },
        { model: Dieta, through: { attributes: ["CANTIDAD"] } },
        { model: Empaque, through: { attributes: ["CANTIDAD"] } },
        { model: Usuario, through: { attributes: [] } },
      ],
    });

    res.status(201).json(creado);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const actualizar = async (req, res) => {
  const pedido = await Pedido.findByPk(req.params.id);
  if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

  const { ID_CLIENTE, ID_AREA, TIPO_COMIDA, FECHA, OBSERVACIONES,
          dietas, empaques, usuarios } = req.body;

  await pedido.update({ ID_CLIENTE, ID_AREA, TIPO_COMIDA, FECHA, OBSERVACIONES });

  // si vienen arrays, reescribimos relaciones
  if (Array.isArray(dietas)) {
    await PedidoDieta.destroy({ where: { ID_PEDIDO: pedido.ID_PEDIDO } });
    for (const d of dietas) {
      await PedidoDieta.create({
        ID_PEDIDO: pedido.ID_PEDIDO,
        CODIGO_DIETA: d.CODIGO_DIETA,
        CANTIDAD: d.CANTIDAD ?? 1,
      });
    }
  }
  if (Array.isArray(empaques)) {
    await PedidoEmpaque.destroy({ where: { ID_PEDIDO: pedido.ID_PEDIDO } });
    for (const e of empaques) {
      await PedidoEmpaque.create({
        ID_PEDIDO: pedido.ID_PEDIDO,
        ID_EMPAQUE: e.ID_EMPAQUE,
        CANTIDAD: e.CANTIDAD ?? 1,
      });
    }
  }
  if (Array.isArray(usuarios)) {
    await pedido.setUsuarios(usuarios); // reemplaza todos
  }

  const actualizado = await Pedido.findByPk(pedido.ID_PEDIDO, {
    include: [
      { model: Cliente }, { model: Area },
      { model: Dieta, through: { attributes: ["CANTIDAD"] } },
      { model: Empaque, through: { attributes: ["CANTIDAD"] } },
      { model: Usuario, through: { attributes: [] } },
    ],
  });

  res.json(actualizado);
};

export const eliminar = async (req, res) => {
  const pedido = await Pedido.findByPk(req.params.id);
  if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

  await PedidoDieta.destroy({ where: { ID_PEDIDO: pedido.ID_PEDIDO } });
  await PedidoEmpaque.destroy({ where: { ID_PEDIDO: pedido.ID_PEDIDO } });
  await pedido.setUsuarios([]); // limpia M:N
  await pedido.destroy();

  res.json({ ok: true });
};
*/

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
        { model: Cliente, attributes: ["id_cliente", "nombre"] },
        { model: Area, attributes: ["id_area", "nombre_area"] },
        { model: Dieta, through: { attributes: ["cantidad"] } },
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
        { model: Cliente, attributes: ["id_cliente", "nombre"] },
        { model: Area, attributes: ["id_area", "nombre_area"] },
        { model: Dieta, through: { attributes: ["cantidad"] } },
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
