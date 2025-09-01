/*import { Dieta } from "../models/index.js";

export const listar = async (_, res) => res.json(await Dieta.findAll());
export const obtener = async (req, res) => {
  const r = await Dieta.findByPk(req.params.id);
  if (!r) return res.status(404).json({ error: "No encontrado" });
  res.json(r);
};
export const crear = async (req, res) => {
  try { res.json(await Dieta.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
};
export const actualizar = async (req, res) => {
  const r = await Dieta.findByPk(req.params.id);
  if (!r) return res.status(404).json({ error: "No encontrado" });
  await r.update(req.body); res.json(r);
};
export const eliminar = async (req, res) => {
  const r = await Dieta.findByPk(req.params.id);
  if (!r) return res.status(404).json({ error: "No encontrado" });
  await r.destroy(); res.json({ ok: true });
};
*/


import { Dieta } from "../models/index.js";

export const createDieta = async (req, res) => {
  try { const x = await Dieta.create(req.body); res.status(201).json(x); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const getDietas = async (_req, res) => {
  try { res.json(await Dieta.findAll()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const getDietaById = async (req, res) => {
  try {
    const x = await Dieta.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Dieta no encontrada" });
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateDieta = async (req, res) => {
  try {
    const x = await Dieta.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Dieta no encontrada" });
    await x.update(req.body);
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteDieta = async (req, res) => {
  try {
    const x = await Dieta.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Dieta no encontrada" });
    await x.destroy();
    res.json({ message: "Dieta eliminada" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
