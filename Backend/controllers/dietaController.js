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
