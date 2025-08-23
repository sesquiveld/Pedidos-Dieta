// controllers/clienteController.js
import { Cliente } from "../models/index.js";

// Crear cliente
export const createCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener cliente por ID
export const getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });

    await cliente.update(req.body);
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cliente
export const deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });

    await cliente.destroy();
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {createCliente, getClientes, getClienteById, updateCliente, deleteCliente}
