import { Cliente, Area, ClienteArea } from "../models/index.js";

export const linkClienteArea = async (req, res) => {
  try {
    const { ID_CLIENTE, ID_AREA } = req.body;
    await ClienteArea.create({ ID_CLIENTE, ID_AREA });
    res.status(201).json({ message: "Relación Cliente-Área creada" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const unlinkClienteArea = async (req, res) => {
  try {
    const { idCliente, idArea } = req.params;
    await ClienteArea.destroy({ where: { ID_CLIENTE: idCliente, ID_AREA: idArea } });
    res.json({ message: "Relación Cliente-Área eliminada" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getAreasDeCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.idCliente, {
      include: [{ model: Area }],
    });
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(cliente.Areas ?? []);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getClientesDeArea = async (req, res) => {
  try {
    const area = await Area.findByPk(req.params.idArea, {
      include: [{ model: Cliente }],
    });
    if (!area) return res.status(404).json({ error: "Área no encontrada" });
    res.json(area.Clientes ?? []);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
