import { Usuario } from "../models/index.js";

export const createUsuario = async (req, res) => {
  try { const x = await Usuario.create(req.body); res.status(201).json(x); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const getUsuarios = async (_req, res) => {
  try { res.json(await Usuario.findAll()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

export const getUsuarioById = async (req, res) => {
  try {
    const x = await Usuario.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateUsuario = async (req, res) => {
  try {
    const x = await Usuario.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Usuario no encontrado" });
    await x.update(req.body);
    res.json(x);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteUsuario = async (req, res) => {
  try {
    const x = await Usuario.findByPk(req.params.id);
    if (!x) return res.status(404).json({ error: "Usuario no encontrado" });
    await x.destroy();
    res.json({ message: "Usuario eliminado" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
