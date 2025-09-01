import { ClienteDieta, Dieta, Cliente } from "../models/index.js";

export const addDietaToCliente = async (req, res) => {
  try {
    const { codigo_dieta, id_cliente } = req.body;
    const x = await ClienteDieta.create({ codigo_dieta, id_cliente });
    res.status(201).json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const removeDietaFromCliente = async (req, res) => {
  try {
    const { coddieta, idcliente } = req.params;
    await ClienteDieta.destroy({ where: { codigo_dieta: coddieta, id_cliente: idcliente } });
    res.json({ message: "Dieta eliminada para el Cliente" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getDietaCliente = async (req, res) => {
  try {
    const dieta = await dieta.findByPk(req.params.codigodieta, { include: [Dieta] });
    if (!dieta) return res.status(404).json({ error: "dieta no encontrada" });
    res.json(Cliente.dieta ?? []);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
