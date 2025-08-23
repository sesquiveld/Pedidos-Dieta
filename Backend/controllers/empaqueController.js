import { Empaque } from "../models/index.js";

export const createEmpaque = async (req, res) => {
  try { const x = await Empaque.create(req.body); res.status(201).json(x); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const getEmpaques = async (_req, res) => {
  try { res.json(await Empaque.findAll()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const getEmpaqueById = async (req, res) => {
  try {
    const x = await Empaque.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Empaque no encontrado" });
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateEmpaque = async (req, res) => {
  try {
    const x = await Empaque.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Empaque no encontrado" });
    await x.update(req.body);
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteEmpaque = async (req, res) => {
  try {
    const x = await Empaque.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Empaque no encontrado" });
    await x.destroy();
    res.json({ message: "Empaque eliminado" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
