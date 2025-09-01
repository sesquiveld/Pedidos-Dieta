/*import { Area } from "../models/index.js";

export const listar = async (_, res) => res.json(await Area.findAll());
export const obtener = async (req, res) => {
  const r = await Area.findByPk(req.params.id);
  if (!r) return res.status(404).json({ error: "No encontrado" });
  res.json(r);
};
export const crear = async (req, res) => {
  try { res.json(await Area.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
};
export const actualizar = async (req, res) => {
  const r = await Area.findByPk(req.params.id);
  if (!r) return res.status(404).json({ error: "No encontrado" });
  await r.update(req.body); res.json(r);
};
export const eliminar = async (req, res) => {
  const r = await Area.findByPk(req.params.id);
  if (!r) return res.status(404).json({ error: "No encontrado" });
  await r.destroy(); res.json({ ok: true });
};

*/

import { Area } from "../models/index.js";

export const createArea = async (req, res) => {
  try { const x = await Area.create(req.body); res.status(201).json(x); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const getAreas = async (_req, res) => {
  try { res.json(await Area.findAll()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const getAreaById = async (req, res) => {
  try {
    const x = await Area.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Área no encontrada" });
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateArea = async (req, res) => {
  try {
    const x = await Area.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Área no encontrada" });
    await x.update(req.body);
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteArea = async (req, res) => {
  try {
    const x = await Area.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Área no encontrada" });
    await x.destroy();
    res.json({ message: "Área eliminada" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
