import { Op, Sequelize } from "sequelize";
import { generarExcelSimple, generarExcelMultiple, generarFacturaExcel } from "../services/excelService.js";
import PDFDocument from "pdfkit";

import {
  Pedido,
  Cliente,
  Area,
  Dieta,
  Empaque,
  PedidoDieta,
  PedidoEmpaque,
} from "../models/index.js";


// ======================================================
// 1. REPORTE: Resumen por fechas (cliente + tipo comida)
// ======================================================

export const reporteResumenFechas = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const pedidos = await Pedido.findAll({
      where: {
        fecha: { [Op.between]: [desde, hasta] }
      },
      include: [
        { model: Cliente },
        { model: PedidoDieta },
        { model: PedidoEmpaque }
      ]
    });

    const resultado = [];

    for (const p of pedidos) {
      const totalDietas = p.PedidoDietas.reduce((s, d) => s + d.precio_tdietas, 0);
      const totalEmpaques = p.PedidoEmpaques.reduce((s, e) => s + e.precio_tempaques, 0);

      resultado.push({
        id_pedido: p.id_pedido,
        cliente: p.Cliente?.nombre_cliente,
        tipo_comida: p.tipo_comida,
        fecha: p.fecha,
        totalDietas,
        totalEmpaques,
        total: totalDietas + totalEmpaques
      });
    }

    return res.json(resultado);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando reporte resumen por fechas" });
  }
};


// ======================================================
// 2. REPORTE: Detallado por cliente
// ======================================================

export const reportePorCliente = async (req, res) => {
  try {
    const { id_cliente, desde, hasta } = req.query;

    const pedidos = await Pedido.findAll({
      where: {
        id_cliente,
        fecha: { [Op.between]: [desde, hasta] }
      },
      include: [
        { model: PedidoDieta, include: [Dieta] },
        { model: PedidoEmpaque, include: [Empaque] }
      ]
    });

    const dietas = [];
    const empaques = [];

    for (const p of pedidos) {
      for (const d of p.PedidoDietas) {
        dietas.push({
          tipo_comida: p.tipo_comida,
          fecha: p.fecha,
          dieta: d.Dieta?.nombre_dieta,
          cantidad: d.cantidad,
          precio_unitario: d.precio,
          total: d.precio_tdietas
        });
      }
      for (const e of p.PedidoEmpaques) {
        empaques.push({
          fecha: p.fecha,
          empaque: e.Empaque?.nombre_empaque,
          cantidad: e.cantidad,
          precio_unitario: e.precio_empaque,
          total: e.precio_tempaques
        });
      }
    }

    return res.json({ dietas, empaques });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando reporte por cliente" });
  }
};


// ======================================================
// 3. REPORTE: Totales por área y tipo comida
// ======================================================

export const reportePorAreaTipo = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const rows = await Pedido.findAll({
      where: {
        fecha: { [Op.between]: [desde, hasta] }
      },
      include: [
        { model: Area },
        {
          model: PedidoDieta,
          attributes: []
        }
      ],
      attributes: [
        "id_area",
        "tipo_comida",
        [Sequelize.fn("SUM", Sequelize.col("PedidoDietas.cantidad")), "totalDietas"]
      ],
      group: ["id_area", "tipo_comida", "Area.nombre_area"]
    });

    return res.json(rows);

  } catch (err) {
    res.status(500).json({ error: "Error generando reporte por área/tipo" });
  }
};


// ======================================================
// 4. REPORTE: Picklist cocina
// ======================================================

export const reportePicklistCocina = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const rows = await PedidoDieta.findAll({
      include: [
        {
          model: Pedido,
          where: { fecha: { [Op.between]: [desde, hasta] } },
          include: [Cliente, Area]
        },
        { model: Dieta }
      ],
      attributes: [
        "codigo_dieta",
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_total"]
      ],
      group: [
        "Pedido.id_cliente",
        "Pedido.id_area",
        "Pedido.tipo_comida",
        "codigo_dieta",
        "Dieta.nombre_dieta"
      ]
    });

    return res.json(rows);

  } catch (err) {
    res.status(500).json({ error: "Error generando picklist cocina" });
  }
};


// ======================================================
// 5. REPORTE: Facturación mensual por cliente
// ======================================================

export const reporteFacturacion = async (req, res) => {
  try {
    const { id_cliente, desde, hasta } = req.query;

    const dietas = await PedidoDieta.findAll({
      attributes: [
        "codigo_dieta",
        [Sequelize.fn("SUM", Sequelize.col("PedidoDieta.cantidad")), "cantidad_total"],
        [Sequelize.fn("SUM", Sequelize.col("precio_tdietas")), "total_precio"]
      ],
      include: [
        { model: Dieta },
        {
          model: Pedido,
          attributes: [],
          where: {
            id_cliente,
            fecha: { [Op.between]: [desde, hasta] }
          }
        }
      ],
      group: ["codigo_dieta", "Dieta.nombre_dieta"]
    });

    const empaques = await PedidoEmpaque.findAll({
      attributes: [
        "id_empaque",
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_total"],
        [Sequelize.fn("SUM", Sequelize.col("precio_tempaques")), "total_precio"]
      ],
      include: [
        { model: Empaque },
        {
          model: Pedido,
          attributes: [],
          where: {
            id_cliente,
            fecha: { [Op.between]: [desde, hasta] }
          }
        }
      ],
      group: ["id_empaque", "Empaque.nombre_empaque"]
    });

    return res.json({ dietas, empaques });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en facturación" });
  }
};


// ======================================================
// 6. REPORTE: Totales de dietas por cliente en rango
// ======================================================

export const reporteTotalesDietasCliente = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const rows = await PedidoDieta.findAll({
      attributes: [
        [Sequelize.col("Pedido.id_cliente"), "id_cliente"],
        [Sequelize.fn("SUM", Sequelize.col("PedidoDieta.cantidad")), "total_dietas"]
      ],
      include: [
        {
          model: Pedido,
          where: { fecha: { [Op.between]: [desde, hasta] } }
        }
      ],
      group: ["Pedido.id_cliente"]
    });

    return res.json(rows);

  } catch (err) {
    res.status(500).json({ error: "Error en totales por cliente" });
  }
};


// ======================================================
// 7. REPORTE: Totales por cliente y área
// ======================================================

export const reporteTotalesDietasClienteArea = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const rows = await PedidoDieta.findAll({
      attributes: [
        [Sequelize.col("Pedido.id_cliente"), "id_cliente"],
        [Sequelize.col("Pedido.id_area"), "id_area"],
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "total_dietas"]
      ],
      include: [
        {
          model: Pedido,
          attributes: [],
          where: { fecha: { [Op.between]: [desde, hasta] } }
        }
      ],
      group: ["Pedido.id_cliente", "Pedido.id_area"]
    });

    return res.json(rows);

  } catch (err) {
    res.status(500).json({ error: "Error en totales cliente/área" });
  }
};

// Generar archivos en Excel 
import { generarExcelMultiple } from "../services/excelService.js";


/*export const descargarFacturacionExcel = async (req, res) => {
  try {
    const { id_cliente, desde, hasta } = req.query;

    // reutilizamos la función existente
    const dietas = await PedidoDieta.findAll({
      attributes: [
        "codigo_dieta",
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_total"],
        [Sequelize.fn("SUM", Sequelize.col("precio_tdietas")), "total_precio"]
      ],
      include: [
        { model: Dieta },
        {
          model: Pedido,
          attributes: [],
          where: { id_cliente, fecha: { [Op.between]: [desde, hasta] } }
        }
      ],
      group: ["codigo_dieta", "Dieta.nombre_dieta"]
    });

    const empaques = await PedidoEmpaque.findAll({
      attributes: [
        "id_empaque",
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_total"],
        [Sequelize.fn("SUM", Sequelize.col("precio_tempaques")), "total_precio"]
      ],
      include: [
        { model: Empaque },
        {
          model: Pedido,
          attributes: [],
          where: { id_cliente, fecha: { [Op.between]: [desde, hasta] } }
        }
      ],
      group: ["id_empaque", "Empaque.nombre_empaque"]
    });

    const libro = {
      Dietas: dietas.map((d) => ({
        codigo_dieta: d.codigo_dieta,
        nombre_dieta: d.Dieta?.nombre_dieta,
        cantidad_total: d.dataValues.cantidad_total,
        total_precio: d.dataValues.total_precio
      })),
      Empaques: empaques.map((e) => ({
        id_empaque: e.id_empaque,
        nombre_empaque: e.Empaque?.nombre_empaque,
        cantidad_total: e.dataValues.cantidad_total,
        total_precio: e.dataValues.total_precio
      }))
    };

    const buffer = await generarExcelMultiple(libro);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=facturacion_${id_cliente}_${desde}_${hasta}.xlsx`);
    return res.send(buffer);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error generando Excel" });
  }
};
*/

// REporte en Excel 
// ---------- helper para enviar buffer excel ----------
const sendExcelBuffer = (res, buffer, filename) => {
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  return res.send(buffer);
};

// ============== FACTURACION - EXCEL =================
export const descargarFacturacionExcel = async (req, res) => {
  try {
    const { id_cliente, desde, hasta } = req.query;
    // consultamos dietas y empaques como antes
    const dietas = await PedidoDieta.findAll({
      attributes: [
        "codigo_dieta",
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_total"],
        [Sequelize.fn("SUM", Sequelize.col("precio_tdietas")), "total_precio"]
      ],
      include: [{ model: Dieta }],
      includeIgnoreAttributes: false,
      includeNames: true,
      where: {},
      group: ["codigo_dieta", "Dieta.nombre_dieta"],
      include: [{ model: Pedido, attributes: [], where: { id_cliente, fecha: { [Op.between]: [desde, hasta] } } }, { model: Dieta }]
    });

    const empaques = await PedidoEmpaque.findAll({
      attributes: [
        "id_empaque",
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_total"],
        [Sequelize.fn("SUM", Sequelize.col("precio_tempaques")), "total_precio"]
      ],
      include: [{ model: Empaque }],
      group: ["id_empaque", "Empaque.nombre_empaque"],
      where: {},
      include: [{ model: Pedido, attributes: [], where: { id_cliente, fecha: { [Op.between]: [desde, hasta] } } }, { model: Empaque }]
    });

    const libro = {
      Dietas: dietas.map((d) => ({
        codigo_dieta: d.codigo_dieta,
        nombre_dieta: d.Dieta?.nombre_dieta,
        cantidad_total: d.dataValues.cantidad_total,
        total_precio: d.dataValues.total_precio
      })),
      Empaques: empaques.map((e) => ({
        id_empaque: e.id_empaque,
        nombre_empaque: e.Empaque?.nombre_empaque,
        cantidad_total: e.dataValues.cantidad_total,
        total_precio: e.dataValues.total_precio
      }))
    };

    const buffer = await generarExcelMultiple(libro);
    return sendExcelBuffer(res, buffer, `facturacion_${id_cliente}_${desde}_${hasta}.xlsx`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando Excel de facturación" });
  }
};

// ============== RESUMEN FECHAS - EXCEL =================
export const descargarResumenFechasExcel = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const pedidos = await Pedido.findAll({
      where: {
        fecha: { [Op.between]: [desde, hasta] }
      },
      include: [
        { model: Cliente },
        { model: PedidoDieta },
        { model: PedidoEmpaque }
      ],
      order: [["fecha", "ASC"], ["id_pedido", "ASC"]]
    });

    const tabla = pedidos.map((p) => {
      const totalDietas = p.PedidoDietas.reduce((s, d) => s + Number(d.precio_tdietas), 0);
      const totalEmpaques = p.PedidoEmpaques.reduce((s, e) => s + Number(e.precio_tempaques), 0);

      return {
        ID_Pedido: p.id_pedido,
        Cliente: p.Cliente?.nombre_cliente,
        Fecha: p.fecha,
        Tipo_Comida: p.tipo_comida,
        Total_Dietas: totalDietas,
        Total_Empaques: totalEmpaques,
        Total: totalDietas + totalEmpaques,
      };
    });

    const buffer = await generarExcelSimple("Resumen por Fechas", tabla);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resumen_fechas_${desde}_${hasta}.xlsx`
    );

    return res.send(buffer);

  } catch (err) {
    console.error("Error generando Excel resumen:", err);
    res.status(500).json({ error: "Error generando Excel del resumen" });
  }
};

/*export const descargarResumenFechasExcel = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    // agrupar pedidos por cliente + tipo comida
    const pedidos = await Pedido.findAll({
      where: { fecha: { [Op.between]: [desde, hasta] } },
      include: [{ model: Cliente }, { model: PedidoDieta }, { model: PedidoEmpaque }]
    });

    const rows = pedidos.map((p) => {
      const totalDietas = (p.PedidoDietas || []).reduce((s, d) => s + (Number(d.precio_tdietas) || 0), 0);
      const totalEmpaques = (p.PedidoEmpaques || []).reduce((s, e) => s + (Number(e.precio_tempaques) || 0), 0);
      return {
        id_pedido: p.id_pedido,
        cliente: p.Cliente?.nombre,
        tipo_comida: p.tipo_comida,
        fecha: p.fecha,
        totalDietas,
        totalEmpaques,
        total: totalDietas + totalEmpaques
      };
    });

    const buffer = await generarExcelSimple("Resumen", rows);
    return sendExcelBuffer(res, buffer, `resumen_fechas_${desde}_${hasta}.xlsx`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando resumen fechas Excel" });
  }
};
*/
// ============== POR AREA/TIPO - EXCEL =================
export const descargarPorAreaTipoExcel = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const rows = await Pedido.findAll({
      where: { fecha: { [Op.between]: [desde, hasta] } },
      include: [{ model: Area }, { model: PedidoDieta, attributes: [] }],
      attributes: [
        "id_area",
        [Sequelize.col("Area.nombre_area"), "area_nombre"],
        "tipo_comida",
        [Sequelize.fn("SUM", Sequelize.col("PedidoDietas.cantidad")), "totalDietas"]
      ],
      group: ["id_area", "tipo_comida", "Area.nombre_area"]
    });

    const out = rows.map((r) => ({
      id_area: r.id_area,
      area_nombre: r.dataValues.area_nombre,
      tipo_comida: r.tipo_comida,
      totalDietas: r.dataValues.totalDietas
    }));

    const buffer = await generarExcelSimple("PorAreaTipo", out);
    return sendExcelBuffer(res, buffer, `por_area_tipo_${desde}_${hasta}.xlsx`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando por area/tipo Excel" });
  }
};

// ============== PICKLIST COCINA - EXCEL =================
export const descargarPicklistCocinaExcel = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const rows = await PedidoDieta.findAll({
      attributes: [
        [Sequelize.col("Pedido.id_cliente"), "id_cliente"],
        [Sequelize.col("Pedido.id_area"), "id_area"],
        [Sequelize.col("Pedido.tipo_comida"), "tipo_comida"],
        "codigo_dieta",
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_total"]
      ],
      include: [
        { model: Pedido, attributes: [], where: { fecha: { [Op.between]: [desde, hasta] } } },
        { model: Dieta, attributes: ["nombre_dieta"] }
      ],
      group: ["Pedido.id_cliente", "Pedido.id_area", "Pedido.tipo_comida", "codigo_dieta", "Dieta.nombre_dieta"]
    });

    const out = rows.map((r) => ({
      id_cliente: r.dataValues.id_cliente,
      id_area: r.dataValues.id_area,
      tipo_comida: r.dataValues.tipo_comida,
      codigo_dieta: r.codigo_dieta,
      nombre_dieta: r.Dieta?.nombre_dieta,
      cantidad_total: r.dataValues.cantidad_total
    }));

    const buffer = await generarExcelSimple("Picklist", out);
    return sendExcelBuffer(res, buffer, `picklist_${desde}_${hasta}.xlsx`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando picklist Excel" });
  }
};

// ============== PICKLIST COCINA - PDF =================
export const descargarPicklistCocinaPDF = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const rows = await PedidoDieta.findAll({
      attributes: [
        [Sequelize.col("Pedido.id_cliente"), "id_cliente"],
        [Sequelize.col("Pedido.id_area"), "id_area"],
        [Sequelize.col("Pedido.tipo_comida"), "tipo_comida"],
        "codigo_dieta",
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_total"]
      ],
      include: [
        { model: Pedido, attributes: ["id_cliente", "id_area", "tipo_comida"], where: { fecha: { [Op.between]: [desde, hasta] } }, include: [Cliente, Area] },
        { model: Dieta, attributes: ["nombre_dieta"] }
      ],
      group: ["Pedido.id_cliente", "Pedido.id_area", "Pedido.tipo_comida", "codigo_dieta", "Dieta.nombre_dieta"]
    });

    // Creamos PDF con pdfkit
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filename = `picklist_${desde}_${hasta}.pdf`;
    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(16).text("Picklist Cocina", { align: "center" });
    doc.moveDown();

    // Agrupar por cliente -> area -> tipo_comida
    const grouped = {};
    rows.forEach((r) => {
      const clienteId = r.dataValues.id_cliente;
      const areaId = r.dataValues.id_area;
      const tipo = r.dataValues.tipo_comida;
      const clienteNombre = r.Pedido?.Cliente?.nombre || `Cliente ${clienteId}`;
      const areaNombre = r.Pedido?.Area?.nombre_area || `Area ${areaId}`;
      const key = `${clienteId}|${areaId}|${tipo}`;
      if (!grouped[key]) grouped[key] = { clienteId, clienteNombre, areaId, areaNombre, tipo, dietas: [] };
      grouped[key].dietas.push({ codigo: r.codigo_dieta, nombre: r.Dieta?.nombre_dieta, cantidad: r.dataValues.cantidad_total });
    });

    for (const key of Object.keys(grouped)) {
      const g = grouped[key];
      doc.fontSize(12).text(`${g.clienteNombre} — ${g.areaNombre} — ${g.tipo}`, { underline: true });
      doc.moveDown(0.2);
      g.dietas.forEach((d) => {
        doc.fontSize(10).text(`• ${d.nombre} (${d.codigo}) — ${d.cantidad}`);
      });
      doc.moveDown();
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando picklist PDF" });
  }
};

// ============== TOTALES DIETAS POR CLIENTE - EXCEL =================
export const descargarTotalesDietasClienteExcel = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const rows = await PedidoDieta.findAll({
      attributes: [
        [Sequelize.col("Pedido.id_cliente"), "id_cliente"],
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "total_dietas"]
      ],
      include: [{ model: Pedido, attributes: [], where: { fecha: { [Op.between]: [desde, hasta] } } }],
      group: ["Pedido.id_cliente"]
    });

    const out = rows.map((r) => ({ id_cliente: r.dataValues.id_cliente, total_dietas: r.dataValues.total_dietas }));
    const buffer = await generarExcelSimple("TotalesPorCliente", out);
    return sendExcelBuffer(res, buffer, `totales_dietas_cliente_${desde}_${hasta}.xlsx`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando totales dietas cliente" });
  }
};

// ============== TOTALES DIETAS CLIENTE/AREA - EXCEL =================
export const descargarTotalesDietasClienteAreaExcel = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const rows = await PedidoDieta.findAll({
      attributes: [
        [Sequelize.col("Pedido.id_cliente"), "id_cliente"],
        [Sequelize.col("Pedido.id_area"), "id_area"],
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "total_dietas"]
      ],
      include: [{ model: Pedido, attributes: [], where: { fecha: { [Op.between]: [desde, hasta] } } }],
      group: ["Pedido.id_cliente", "Pedido.id_area"]
    });

    const out = rows.map((r) => ({
      id_cliente: r.dataValues.id_cliente,
      id_area: r.dataValues.id_area,
      total_dietas: r.dataValues.total_dietas
    }));

    const buffer = await generarExcelSimple("TotalesClienteArea", out);
    return sendExcelBuffer(res, buffer, `totales_cliente_area_${desde}_${hasta}.xlsx`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando totales cliente/area" });
  }
};


// ============== FACTURA PLANTILLA EXCEL =================
export const descargarFacturaPlantillaExcel = async (req, res) => {
  try {
    // param: id_cliente, desde, hasta
    const { id_cliente, desde, hasta } = req.query;
    // datos para plantilla
    const cliente = await Cliente.findByPk(id_cliente);
    const dietasRaw = await PedidoDieta.findAll({
      attributes: [
        "codigo_dieta",
        [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_total"],
        [Sequelize.fn("SUM", Sequelize.col("precio_tdietas")), "total_precio"]
      ],
      include: [{ model: Dieta }, { model: Pedido, attributes: [], where: { id_cliente, fecha: { [Op.between]: [desde, hasta] } } }],
      group: ["codigo_dieta", "Dieta.nombre_dieta"]
    });
    const empaquesRaw = await PedidoEmpaque.findAll({
      attributes: ["id_empaque", [Sequelize.fn("SUM", Sequelize.col("cantidad")), "cantidad_total"], [Sequelize.fn("SUM", Sequelize.col("precio_tempaques")), "total_precio"]],
      include: [{ model: Empaque }, { model: Pedido, attributes: [], where: { id_cliente, fecha: { [Op.between]: [desde, hasta] } } }],
      group: ["id_empaque", "Empaque.nombre_empaque"]
    });

    const dietas = dietasRaw.map(d => ({ codigo_dieta: d.codigo_dieta, nombre_dieta: d.Dieta?.nombre_dieta, cantidad: d.dataValues.cantidad_total, total_precio: d.dataValues.total_precio }));
    const empaques = empaquesRaw.map(e => ({ id_empaque: e.id_empaque, nombre_empaque: e.Empaque?.nombre_empaque, cantidad: e.dataValues.cantidad_total, total_precio: e.dataValues.total_precio }));

    const totales = {
      totalDietas: dietas.reduce((s, x) => s + Number(x.total_precio || 0), 0),
      totalEmpaques: empaques.reduce((s, x) => s + Number(x.total_precio || 0), 0),
      grandTotal: dietas.reduce((s, x) => s + Number(x.total_precio || 0), 0) + empaques.reduce((s, x) => s + Number(x.total_precio || 0), 0),
    };

    const buffer = await generarFacturaExcel({
      clienteInfo: { nombre: cliente?.nombre || "", nit: cliente?.nit || "", direccion: cliente?.direccion || "" },
      period: { desde, hasta },
      dietas,
      empaques,
      totales
    });

    return sendExcelBuffer(res, buffer, `factura_plantilla_${id_cliente}_${desde}_${hasta}.xlsx`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando plantilla factura" });
  }
};