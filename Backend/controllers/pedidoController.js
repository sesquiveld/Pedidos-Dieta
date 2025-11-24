// controllers/pedidoController.js
import { Op } from "sequelize";
import {
  Pedido,
  Cliente,
  Area,
  Dieta,
  Empaque,
  PedidoDieta,
  PedidoEmpaque,
  Usuario,
  ClienteDieta,
} from "../models/index.js";


const TIPO_COMIDA = ["Desayuno", "Almuerzo", "Comida", "Merienda"];
const ESTADOS = ["Pendiente", "Listo", "Cancelado"];

const includesFull = [
  { model: Cliente, attributes: ["id_cliente", "nombre"] },
  { model: Area, attributes: ["id_area", "nombre_area"] },
  {
    model: Dieta,
    attributes: ["codigo_dieta", "nombre_dieta"],
   // through: { attributes: ["cantidad", "precio_unitario"] }, // 👈 traemos el precio guardado
    through: { model: PedidoDieta, attributes: ["cantidad", "precio"] },
  },
  {
    model: Empaque,
    attributes: ["id_empaque", "nombre_empaque", "precio_empaque"],
    //through: { attributes: ["cantidad", "precio"] },
    through: { model: PedidoEmpaque, attributes: ["cantidad", "precio_empaque"] },
  },
  { model: Usuario, attributes: ["id_usuario", "nombre_usuario"] },
];

// ================== CRUD ==================


// Crear pedido

export const createPedido = async (req, res) => {
  const t = await Pedido.sequelize.transaction();
  try {
    // Limpieza de body por seguridad
    delete req.body.id_pedido;
    delete req.body.id_usuario;

    const {
      id_cliente,
      id_area,
      tipo_comida,
      fecha,
      fecha_pedido,
      observaciones = "",
      dietas = [],
      empaques = [],
    } = req.body;

    // usuario desde token (authMiddleware debe poblar req.usuario)
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario) return res.status(401).json({ error: "Usuario no autenticado" });

    /*console.log("USUARIO DEL TOKEN:", req.usuario);
    console.log("BODY RECIBIDO:", req.body);
    console.log("🔑 Token recibido:", req.headers.authorization);
    console.log("✅ Usuario autenticado:", req.usuario);
*/
    // Validaciones mínimas (puedes reforzar)
    if (!id_cliente) return res.status(400).json({ error: "id_cliente requerido" });
    if (!id_area) return res.status(400).json({ error: "id_area requerido" });
    if (!tipo_comida) return res.status(400).json({ error: "tipo_comida requerido" });

    // Crear pedido
    const pedido = await Pedido.create(
      {
        id_cliente,
        id_area,
        id_usuario,
        tipo_comida,
        fecha,
        fecha_pedido,
        observaciones,
        estado_pedido: "Pendiente",
      },
      { transaction: t }
    );

   
    // 2️⃣ Guardar dietas en pedidodieta con precio
  const dietasData = [];
  const dietasSinPrecio = [];
  if (Array.isArray(dietas) && dietas.length > 0) {
  
  
  for (const d of dietas) {
    // 🔍 Buscar precio en clientedieta (por cliente y dieta)
    const clienteDieta = await ClienteDieta.findOne({
      where: { codigo_dieta: d.codigo_dieta, 
               id_cliente 
             },
       transaction: t       
    });
    //const total_dieta = Number(d.cantidad) * Number(d.precio);
    /*if (!clienteDieta) {
      console.warn(
        `⚠️ No se encontró precio para dieta ${d.codigo_dieta} y cliente ${id_cliente}`
      );
      continue; // omitir esta dieta si no tiene precio
    }*/
   if (!clienteDieta) {
      const dietaInfo = await Dieta.findByPk(d.codigo_dieta, { transaction: t });
      dietasSinPrecio.push({
        codigo_dieta: d.codigo_dieta,
        nombre_dieta: dietaInfo ? dietaInfo.nombre_dieta : d.nombre_dieta || null,
        cantidad: d.cantidad || 1,
      });
      continue;
    }

    const cantidad = Number(d.cantidad || 1);
    const precio = Number(clienteDieta.precio); //

    dietasData.push({
      id_pedido: pedido.id_pedido,
      codigo_dieta: d.codigo_dieta,
      cantidad,
      precio,//Number(clienteDieta.precio),  ✅ Guardar precio
      precio_tdietas: Number((cantidad * precio).toFixed(2)), //Number(d.cantidad*clienteDieta.precio),
    });
   
    console.log( precio);
    console.log(cantidad);
  }
  if (dietasSinPrecio.length > 0) {
    // Si faltan precios, hacemos rollback y devolvemos error (para que frontend muestre modal)
    await t.rollback();
    return res.status(400).json({
      error: "Faltan precios para algunas dietas del cliente",
      faltantes: { dietas: dietasSinPrecio },
    });
  }

  if (dietasData.length > 0) {
    await PedidoDieta.bulkCreate(dietasData, { transaction: t });
  }
  
  const test = await ClienteDieta.findOne({ where: { id_cliente, codigo_dieta: dietas[0].codigo_dieta } });
  console.log("🧩 Precio encontrado:", test?.precio);
 
}
    
    // Traer el pedido con includes (ya no pedimos Dieta.precio)
  
  // --- Empaques: validar precio y guardar ---
  const empaquesData = [];
  const empaquesSinPrecio = [];

  if (Array.isArray(empaques) && empaques.length > 0) {
  
    for (const e of empaques) {
      const emp = await Empaque.findByPk(e.id_empaque, { transaction: t });
      if (!emp || emp.precio_empaque == null) {
        empaquesSinPrecio.push({
             id_empaque: e.id_empaque, 
             cantidad: e.cantidad || 1 
        });
      continue;
      }

    const cantidad = Number(e.cantidad || 1);
    const precio = Number(emp.precio_empaque); //emp
    empaquesData.push({
      id_pedido: pedido.id_pedido,
      id_empaque: e.id_empaque,
      cantidad,
      precio_empaque: precio,
      precio_tempaques: Number((cantidad * precio).toFixed(2)),
      
    });
    console.log("la cantidad es:", cantidad);
    console.log("El precio del empaque es", precio);
    
  }
 
  if (empaquesSinPrecio.length > 0) {
    await t.rollback();
    return res.status(400).json({
      error: "Faltan precios para algunos empaques",
      faltantes: { empaques: empaquesSinPrecio },
    });
  }

  if (empaquesData.length > 0) {
    await PedidoEmpaque.bulkCreate(empaquesData, { transaction: t });
  }
  await t.commit();
  
}
  
    //console.log("Includes usados:", includesFull); /******************************************** */
  const creado = await Pedido.findByPk(pedido.id_pedido, { include: includesFull });
  return res.status(201).json(creado);
  
} catch (err) {
    console.error("Error en createPedido:", err);
    if (!t.finished) await t.rollback();
    return res.status(500).json({ error: err.message || "Error creando pedido" });
  }
};


// ================== GET PEDIDOS (con filtros opcionales) ==================
export const getPedidos = async (req, res) => {
  try {
    const { id_cliente, id_area, id_dieta, estado_pedido } = req.query;

    // Construir condiciones dinámicas
    const where = {};
    if (id_cliente) where.id_cliente = id_cliente;
    if (id_area) where.id_area = id_area;
    if (estado_pedido) where.estado_pedido = estado_pedido;

    // Consulta base
    const include = [
      { model: Cliente, attributes: ["id_cliente", "nombre"] },
      { model: Area, attributes: ["id_area", "nombre_area"] },
      {
        model: Dieta,
        attributes: ["codigo_dieta", "nombre_dieta"],
        through: { attributes: ["cantidad"] },
      },
      {
        model: Empaque,
        attributes: ["id_empaque", "nombre_empaque"],
        through: { attributes: ["cantidad"] },
      },
      { model: Usuario, attributes: ["id_usuario", "nombre_usuario"] },
    ];

    // Si se busca por dieta, agregamos filtro adicional
    if (id_dieta) {
      include[2].where = { codigo_dieta: id_dieta };
    }

    const pedidos = await Pedido.findAll({
      where,
      include,
      order: [["fecha", "DESC"]],
    });

    res.json(pedidos);
  } catch (error) {
    console.error("❌ Error en getPedidos:", error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
};



export const getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [
        {
          model: Cliente,
          attributes: ["id_cliente", "nombre"],
        },
        {
          model: Area,
          attributes: ["id_area", "nombre_area"],
        },
        {
          model: Dieta,
          attributes: ["codigo_dieta", "nombre_dieta"],
          //through: { attributes: ["cantidad", "precio"] }, // 👈 traemos el precio guardado
          through: { model: PedidoDieta, attributes: ["cantidad", "precio", "precio_tdietas"] },
        },
        {
          model: Empaque,
          attributes: ["id_empaque", "nombre_empaque", "precio_empaque"],
          //through: { attributes: ["cantidad",  "precio_empaque"] },
          through: { model: PedidoEmpaque, attributes: ["cantidad", "precio_empaque", "precio_tempaques"] },
        },
        {
          model: Usuario,
          attributes: ["id_usuario", "nombre_usuario", "tipo_usuario"],
        },
        
      ],
    });

    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

    // Reorganizamos para el frontend
    const resultado = {
      id_pedido: pedido.id_pedido,
      id_cliente: pedido.Cliente?.id_cliente ?? null,
      cliente_nombre: pedido.Cliente?.nombre ?? "",
      id_area: pedido.Area?.id_area ?? null,
      area_nombre: pedido.Area?.nombre_area ?? "",
      id_usuario: pedido.Usuario?.id_usuario ?? null,
      tipo_comida: pedido.tipo_comida,
      fecha: pedido.fecha,
      fecha_pedido: pedido.fecha_pedido,
      observaciones: pedido.observaciones,
      estado_pedido: pedido.estado_pedido,
      // 👇 Verificaciones seguras para evitar el error de map
      dietas: pedido.Dieta?.map((d) => ({
        codigo_dieta: d.codigo_dieta,
        nombre_dieta: d.nombre_dieta,
        cantidad: d.PedidoDieta?.cantidad ?? 0,
       // precio: d.PedidoDieta?.precio ?? 0,
      })) || [],
      empaques: pedido.Empaques?.map((e) => ({
        id_empaque: e.id_empaque,
        nombre_empaque: e.nombre_empaque,
        cantidad: e.PedidoEmpaque?.cantidad ?? 0,
        //precio_empaque: e.PedidoEmpaque?.precio ?? e.precio_empaque ?? 0,
      })) || [],

    };

    res.json(resultado);
  } catch (err) {
    console.error("Error en getPedidoById:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===================== ACTUALIZAR PEDIDO =====================

export const updatePedido = async (req, res) => {
  const t = await Pedido.sequelize.transaction();

  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [PedidoDieta, PedidoEmpaque],
    });

    if (!pedido)
      return res.status(404).json({ error: "Pedido no encontrado" });

    // 🧠 Si está cancelado no se puede editar
    if (pedido.estado_pedido === "Cancelado") {
      return res
        .status(400)
        .json({ error: "Los pedidos cancelados no pueden modificarse." });
    }

    // 🧠 Si está "Listo", solo puede cambiar a "Cancelado"
    if (pedido.estado_pedido === "Listo") {
      const { estado_pedido } = req.body;
      if (estado_pedido === "Cancelado") {
        await pedido.update({ estado_pedido }, { transaction: t });
        await t.commit();
        return res.json({ message: "Pedido cancelado correctamente." });
      }
      return res.status(400).json({
        error: "Solo se puede cambiar el estado de Listo a Cancelado.",
      });
    }

    // 🧩 Si está pendiente, puede editar todo
    const {
      id_cliente,
      id_area,
      tipo_comida,
      fecha,
      fecha_pedido,
      observaciones,
      estado_pedido,
      dietas,
      empaques,
    } = req.body;

    // ✅ Actualizar datos básicos del pedido
    await pedido.update(
      {
        id_cliente,
        id_area,
        tipo_comida,
        fecha,
        fecha_pedido,
        observaciones,
        estado_pedido,
      },
      { transaction: t }
    );

    // ======================= ACTUALIZAR DIETAS =======================
    if (Array.isArray(dietas)) {
      await PedidoDieta.destroy({
        where: { id_pedido: pedido.id_pedido },
        transaction: t,
      });

      for (const d of dietas) {
        // 🔎 Buscar precio del cliente en la tabla clientedieta
        const dietaCliente = await ClienteDieta.findOne({
          where: {
            codigo_dieta: d.codigo_dieta,
            id_cliente: id_cliente,
          },
        });

        const precio = dietaCliente
          ? dietaCliente.precio
          : 0; // Si no tiene precio, 0 por defecto

        await PedidoDieta.create(
          {
            id_pedido: pedido.id_pedido,
            codigo_dieta: d.codigo_dieta,
            cantidad: Number(d.cantidad || 1),
            precio,
          },
          { transaction: t }
        );
      }
    }

    // ======================= ACTUALIZAR EMPAQUES =======================
    if (Array.isArray(empaques)) {
      await PedidoEmpaque.destroy({
        where: { id_pedido: pedido.id_pedido },
        transaction: t,
      });

      for (const e of empaques) {
        // 🔎 Buscar precio del empaque
        const empaque = await Empaque.findByPk(e.id_empaque);
        const precio_empaque = empaque ? empaque.precio_empaque : 0;

        await PedidoEmpaque.create(
          {
            id_pedido: pedido.id_pedido,
            id_empaque: e.id_empaque,
            cantidad: Number(e.cantidad || 1),
            precio_empaque,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    const actualizado = await Pedido.findByPk(pedido.id_pedido, {
      include: [
        {
          model: Cliente,
          attributes: ["id_cliente", "nombre"],
        },
        {
          model: Area,
          attributes: ["id_area", "nombre_area"],
        },
        {
          model: Dieta,
         // as: "Dietas",
          attributes: ["codigo_dieta", "nombre_dieta"],
          //through: { attributes: ["cantidad", "precio"] },
          through: { model: PedidoDieta, attributes: ["cantidad", "precio"] },
        },
        {
          model: Empaque,
         // as: "Empaques",
          attributes: ["id_empaque", "nombre_empaque"],
          //through: { attributes: ["cantidad", "precio_empaque"] },
          through: { model: PedidoEmpaque, attributes: ["cantidad", "precio_empaque"] },
        },
        {
          model: Usuario,
          attributes: ["id_usuario", "nombre_usuario", "tipo_usuario"],
        },
      ],
    });

    res.json(actualizado);
  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error("Error en updatePedido:", err);
    res.status(500).json({ error: err.message });
  }
};


// Eliminar pedido
export const deletePedido = async (req, res) => {
  const t = await Pedido.sequelize.transaction();
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

    await PedidoDieta.destroy({
      where: { id_pedido: pedido.id_pedido },
      transaction: t,
    });
    await PedidoEmpaque.destroy({
      where: { id_pedido: pedido.id_pedido },
      transaction: t,
    });
    await pedido.destroy({ transaction: t });

    await t.commit();
    res.json({ message: "Pedido eliminado" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

// ================== REPORTES ==================

// Reporte por cliente y rango de fechas
export const reportPorCliente = async (req, res) => {
  try {
    const { id_cliente, desde, hasta } = req.query;
    if (!id_cliente || !desde || !hasta) {
      return res
        .status(400)
        .json({ error: "id_cliente, desde y hasta requeridos" });
    }

    const pedidos = await Pedido.findAll({
      where: { id_cliente, fecha: { [Op.between]: [desde, hasta] } },
      include: [Area, { model: Dieta, through: { attributes: ["cantidad"] } }],
    });

    const resumen = {};
    for (const p of pedidos) {
      if (!resumen[p.Area.nombre_area]) {
        resumen[p.Area.nombre_area] = {
          Desayuno: 0,
          Almuerzo: 0,
          Comida: 0,
          Merienda: 0,
        };
      }
      const totalDietas = p.Dietas.reduce(
        (s, d) => s + d.PedidoDieta.cantidad,
        0
      );
      resumen[p.Area.nombre_area][p.tipo_comida] += totalDietas;
    }

    res.json(resumen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reporte por usuario logueado
export const reportPorUsuario = async (req, res) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario)
      return res.status(401).json({ error: "Usuario no autenticado" });

    const pedidos = await Pedido.findAll({
      where: { id_usuario },
      include: includesFull,
    });

    res.json({ total: pedidos.length, pedidos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Facturación por cliente y rango de fechas
export const facturaCliente = async (req, res) => {
  try {
    const { id_cliente, desde, hasta } = req.query;
    if (!id_cliente || !desde || !hasta) {
      return res
        .status(400)
        .json({ error: "id_cliente, desde y hasta requeridos" });
    }

    const pedidos = await Pedido.findAll({
      where: { id_cliente, fecha: { [Op.between]: [desde, hasta] } },
      include: includesFull,
    });

    const resumen = {};
    let totalGeneral = 0;

    for (const p of pedidos) {
      const area = p.Area.nombre_area;
      if (!resumen[area])
        resumen[area] = {
          Desayuno: 0,
          Almuerzo: 0,
          Comida: 0,
          Merienda: 0,
          total: 0,
        };

      // Dietas
      for (const d of p.Dietas) {
        const subtotal =
          d.PedidoDieta.cantidad * (d.PedidoDieta.precio || 0);
        resumen[area][p.tipo_comida] += subtotal;
        resumen[area].total += subtotal;
        totalGeneral += subtotal;
      }

      // Empaques
      for (const e of p.Empaques) {
        const subtotal = e.PedidoEmpaque.cantidad * (e.precio_empaque || 0);
        resumen[area][p.tipo_comida] += subtotal;
        resumen[area].total += subtotal;
        totalGeneral += subtotal;
      }
    }

    res.json({ resumen, totalGeneral });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===================== IMPRESIÓN Y FACTURA =====================
export const printPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: includesFull,
    });
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(pedido);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const reportPorFecha = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    if (!desde || !hasta)
      return res.status(400).json({ error: "desde y hasta requeridos" });

    const range = [];
    const cursor = new Date(desde);
    const end = new Date(hasta);
    while (cursor <= end) {
      range.push(cursor.toISOString().slice(0, 10));
      cursor.setDate(cursor.getDate() + 1);
    }

    const resu = [];
    for (const d of range) {
      const pedidos = await Pedido.findAll({ where: { fecha: d } });
      const ids = pedidos.map((p) => p.id_pedido);

      const totalPedidos = ids.length;
      const totalDietas = ids.length
        ? (await PedidoDieta.sum("cantidad", { where: { id_pedido: ids } })) || 0
        : 0;
      const totalEmpaques = ids.length
        ? (await PedidoEmpaque.sum("cantidad", {
            where: { id_pedido: ids },
          })) || 0
        : 0;

      resu.push({ fecha: d, totalPedidos, totalDietas, totalEmpaques });
    }

    res.json(resu);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
