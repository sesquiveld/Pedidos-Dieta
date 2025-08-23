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
