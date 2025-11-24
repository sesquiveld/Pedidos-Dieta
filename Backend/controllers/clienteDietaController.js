// backend/controllers/clienteDietaController.js
import ClienteDieta from "../models/clienteDietaModels.js";
import Cliente from "../models/clientesModels.js";
import Dieta from "../models/dietaModels.js";

// Obtener todas las relaciones cliente-dieta
export const getClienteDietas = async (req, res) => {
  try {

    const registros = await ClienteDieta.findAll({
  include: [
    { model: Cliente, attributes: ["id_cliente", "nombre"] },
    { model: Dieta, attributes: ["codigo_dieta", "nombre_dieta"] },
  ],
  });
   
    res.json(
      registros.map((r) => ({
        id_cliente: r.id_cliente,
        codigo_dieta: r.codigo_dieta,
        nombre_cliente: r.Cliente?.nombre,
        nombre_dieta: r.Dieta?.nombre_dieta,
        precio: r.precio,
      }))
    );
  } catch (error) {
    console.error("Error cargando cliente-dietas:", error);
    res.status(500).json({ error: "Error cargando cliente-dietas" });
  }
};

// Crear relación cliente-dieta
export const createClienteDieta = async (req, res) => {
  try {
    const { id_cliente, codigo_dieta, precio } = req.body;

    const existe = await ClienteDieta.findOne({
      where: { id_cliente, codigo_dieta },
    });

    if (existe) {
      return res
        .status(400)
        .json({ error: "Ya existe esa dieta para el cliente" });
    }

    await ClienteDieta.create({ id_cliente, codigo_dieta, precio });
    res.json({ message: "Cliente-Dieta creada exitosamente" });
  } catch (error) {
    console.error("Error creando cliente-dieta:", error);
    res.status(500).json({ error: "Error creando cliente-dieta" });
  }
};

// Actualizar precio de cliente-dieta
export const updateClienteDieta = async (req, res) => {
  try {
    const { id_cliente, codigo_dieta } = req.params;
    const { precio } = req.body;

    const registro = await ClienteDieta.findOne({
      where: { id_cliente, codigo_dieta },
    });

    if (!registro) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    registro.precio = precio;
    await registro.save();

    res.json({ message: "Cliente-Dieta actualizado correctamente" });
  } catch (error) {
    console.error("Error actualizando cliente-dieta:", error);
    res.status(500).json({ error: "Error actualizando cliente-dieta" });
  }
};

// Eliminar cliente-dieta
export const deleteClienteDieta = async (req, res) => {
  try {
    const { id_cliente, codigo_dieta } = req.params;

    await ClienteDieta.destroy({ where: { id_cliente, codigo_dieta } });
    res.json({ message: "Cliente-Dieta eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando cliente-dieta:", error);
    res.status(500).json({ error: "Error eliminando cliente-dieta" });
  }
};



