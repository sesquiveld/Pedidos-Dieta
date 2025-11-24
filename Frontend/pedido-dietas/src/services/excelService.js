// services/excelService.js
import ExcelJS from "exceljs";

/**
 * Generar buffer de Excel para una sola hoja de tabla
 * data: Array<Object>
 */
export const generarExcelSimple = async (sheetName = "Reporte", data = []) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  if (!Array.isArray(data) || data.length === 0) {
    sheet.addRow(["No hay datos"]);
    return await workbook.xlsx.writeBuffer();
  }

  // Columnas
  const columns = Object.keys(data[0]).map((k) => ({ header: k, key: k, width: 20 }));
  sheet.columns = columns;

  // Header style
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

  // Filas
  data.forEach((row) => sheet.addRow(row));

  // Ajustes: bordes sencillos
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  return await workbook.xlsx.writeBuffer();
};

/**
 * Generar libro con múltiples hojas.
 * dataObject: { Hoja1: [...], Hoja2: [...] }
 */
export const generarExcelMultiple = async (dataObject = {}) => {
  const workbook = new ExcelJS.Workbook();

  for (const sheetName of Object.keys(dataObject)) {
    const data = dataObject[sheetName] || [];
    const sheet = workbook.addWorksheet(sheetName.substring(0, 31));

    if (!Array.isArray(data) || data.length === 0) {
      sheet.addRow(["No hay datos"]);
      continue;
    }

    sheet.columns = Object.keys(data[0]).map((k) => ({ header: k, key: k, width: 20 }));
    sheet.getRow(1).font = { bold: true };
    data.forEach((r) => sheet.addRow(r));
    sheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
  }

  return await workbook.xlsx.writeBuffer();
};


/**
 * Plantilla de factura (formato más amable)
 * recibe: clienteInfo {nombre, nit, direccion}, period {desde,hasta}, dietas[], empaques[], totales
 */
export const generarFacturaExcel = async ({ clienteInfo = {}, period = {}, dietas = [], empaques = [], totales = {} }) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Factura");

  // Header
  sheet.mergeCells("A1", "E1");
  sheet.getCell("A1").value = "FACTURA - Servicio de Dietas";
  sheet.getCell("A1").font = { size: 14, bold: true };
  sheet.getCell("A1").alignment = { horizontal: "center" };

  sheet.addRow([]);
  sheet.addRow(["Cliente:", clienteInfo.nombre || ""]);
  sheet.addRow(["NIT:", clienteInfo.nit || ""]);
  sheet.addRow(["Dirección:", clienteInfo.direccion || ""]);
  sheet.addRow(["Periodo:", `${period.desde || ""} - ${period.hasta || ""}`]);
  sheet.addRow([]);

  // Dietas table
  if (dietas.length > 0) {
    sheet.addRow(["Dietas"]);
    sheet.addRow(Object.keys(dietas[0])); // header
    dietas.forEach((d) => {
      sheet.addRow(Object.values(d));
    });
    sheet.addRow([]);
  }

  // Empaques table
  if (empaques.length > 0) {
    sheet.addRow(["Empaques"]);
    sheet.addRow(Object.keys(empaques[0]));
    empaques.forEach((e) => sheet.addRow(Object.values(e)));
    sheet.addRow([]);
  }

  // Totales
  sheet.addRow(["Totales"]);
  for (const k of Object.keys(totales)) {
    sheet.addRow([k, totales[k]]);
  }

  // Estilos
  sheet.eachRow((row, rn) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" }
      };
    });
  });

  return await workbook.xlsx.writeBuffer();
};






/*import ExcelJS from "exceljs";

/**
 * Crea un Excel genérico con una hoja y una tabla simple.
 * @param {string} sheetName
 * @param {Array<Object>} data
 * @returns Buffer del archivo Excel
 
export const generarExcelSimple = async (sheetName, data) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName || "Reporte");

  if (!Array.isArray(data) || data.length === 0) {
    sheet.addRow(["No hay datos"]);
    return await workbook.xlsx.writeBuffer();
  }

  // Columnas
  const columnas = Object.keys(data[0]).map((col) => ({
    header: col,
    key: col,
    width: 25
  }));

  sheet.columns = columnas;

  // Filas
  data.forEach((row) => sheet.addRow(row));

  return await workbook.xlsx.writeBuffer();
};


/**
 * Excel con múltiples tablas (ideal facturación)
 * data = { hoja1: [...], hoja2: [...], ... }
 
export const generarExcelMultiple = async (dataObject) => {
  const workbook = new ExcelJS.Workbook();

  for (const hoja in dataObject) {
    const datos = dataObject[hoja];
    const sheet = workbook.addWorksheet(hoja.substring(0, 30));

    if (!Array.isArray(datos) || datos.length === 0) {
      sheet.addRow(["No hay datos"]);
      continue;
    }

    sheet.columns = Object.keys(datos[0]).map((c) => ({
      header: c,
      key: c,
      width: 25
    }));

    datos.forEach((d) => sheet.addRow(d));
  }

  return await workbook.xlsx.writeBuffer();
};
*/