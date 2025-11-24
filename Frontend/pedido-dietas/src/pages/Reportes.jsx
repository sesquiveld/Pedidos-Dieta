// src/pages/Reportes.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const REPORT_TYPES = [
  { value: "resumen_fechas", label: "Resumen por fechas" },
  { value: "por_cliente", label: "Reporte por cliente" },
  { value: "por_area_tipo", label: "Totales por área y tipo" },
  { value: "picklist_cocina", label: "Picklist Cocina" },
  { value: "facturacion", label: "Facturación" },
  { value: "totales_dietas_cliente", label: "Totales dietas por cliente" },
  { value: "totales_dietas_cliente_area", label: "Totales dietas por cliente/área" },
];

export default function Reportes() {
  const [reportType, setReportType] = useState("resumen_fechas");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [cliente, setCliente] = useState("");
  const [clientes, setClientes] = useState([]);
  const [area, setArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const [cR, aR] = await Promise.all([
        axios.get("/api/clientes"),
        axios.get("/api/areas"),
      ]);

      setClientes(Array.isArray(cR.data) ? cR.data : cR.data?.clientes ?? []);
      setAreas(Array.isArray(aR.data) ? aR.data : aR.data?.areas ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Mecanismo seguro para descargar sin que React Router intercepte rutas
  const downloadFile = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // API JSON para mostrar tabla + descargar archivos
  const generate = async () => {
    setMensaje("");

    if (!desde || !hasta) {
      setMensaje("Seleccione un rango de fechas");
      return;
    }

    setLoading(true);
    setData([]);

    try {
      let jsonURL = "";
      let excelURL = "";
      let pdfURL = "";

      switch (reportType) {
        case "resumen_fechas":
          jsonURL = `/api/reportes/resumen-fechas?desde=${desde}&hasta=${hasta}`;
          excelURL = `/api/reportes/resumen-fechas-excel?desde=${desde}&hasta=${hasta}`;
          break;

        case "por_cliente":
          if (!cliente) return setMensaje("Seleccione cliente");
          jsonURL = `/api/reportes/por-cliente?id_cliente=${cliente}&desde=${desde}&hasta=${hasta}`;
          excelURL = `/api/reportes/facturacion-excel?id_cliente=${cliente}&desde=${desde}&hasta=${hasta}`;
          break;

        case "por_area_tipo":
          jsonURL = `/api/reportes/por-area-tipo?desde=${desde}&hasta=${hasta}`;
          excelURL = `/api/reportes/por-area-tipo-excel?desde=${desde}&hasta=${hasta}`;
          break;

        case "picklist_cocina":
          jsonURL = `/api/reportes/picklist-cocina?desde=${desde}&hasta=${hasta}`;
          excelURL = `/api/reportes/picklist-cocina-excel?desde=${desde}&hasta=${hasta}`;
          pdfURL = `/api/reportes/picklist-cocina-pdf?desde=${desde}&hasta=${hasta}`;
          break;

        case "facturacion":
          if (!cliente) return setMensaje("Seleccione cliente");
          jsonURL = `/api/reportes/facturacion?id_cliente=${cliente}&desde=${desde}&hasta=${hasta}`;
          excelURL = `/api/reportes/facturacion-excel?id_cliente=${cliente}&desde=${desde}&hasta=${hasta}`;
          break;

        case "totales_dietas_cliente":
          jsonURL = `/api/reportes/totales-dietas-cliente?desde=${desde}&hasta=${hasta}`;
          excelURL = `/api/reportes/totales-dietas-cliente-excel?desde=${desde}&hasta=${hasta}`;
          break;

        case "totales_dietas_cliente_area":
          jsonURL = `/api/reportes/totales-dietas-cliente-area?desde=${desde}&hasta=${hasta}`;
          excelURL = `/api/reportes/totales-dietas-cliente-area-excel?desde=${desde}&hasta=${hasta}`;
          break;

        default:
          return setMensaje("Tipo de reporte no implementado");
      }

      // cargar datos en pantalla
      const resp = await axios.get(jsonURL);
      setData(resp.data ?? []);

      // dispara descarga excel si el usuario quiere
      if (excelURL) downloadFile(excelURL);

      // picklist PDF adicional
      if (reportType === "picklist_cocina" && pdfURL) {
        setTimeout(() => downloadFile(pdfURL), 400);
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error generando reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">📊 Panel de Reportes</h1>
        <p className="text-gray-600 mb-8">Seleccione un tipo de reporte y el rango de fechas</p>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Tipo de reporte</label>
            <select
              className="w-full border p-2 rounded mt-1"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              {REPORT_TYPES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Desde</label>
            <input type="date" className="w-full border p-2 rounded mt-1" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Hasta</label>
            <input type="date" className="w-full border p-2 rounded mt-1" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </div>

          {/* CLIENTE SOLO PARA REPORTES QUE LO PIDEN */}
          {(reportType === "por_cliente" || reportType === "facturacion") && (
            <div>
              <label className="text-sm font-medium">Cliente</label>
              <select
                className="w-full border p-2 rounded mt-1"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              >
                <option value="">-- Seleccione --</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nombre || c.nombre_cliente}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* BOTONES */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={generate}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded shadow hover:scale-105 transition"
          >
            {loading ? "Generando..." : "Generar / Descargar"}
          </button>
        </div>

        {/* MENSAJE */}
        {mensaje && <p className="mt-4 text-red-500">{mensaje}</p>}

        {/* TABLA PREVIEW */}
        {data.length > 0 && (
          <div className="mt-10 overflow-auto max-h-[500px] border rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  {Object.keys(data[0]).map((col) => (
                    <th key={col} className="border px-3 py-2 text-left text-sm font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-100">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="border px-3 py-2 text-sm">
                        {String(val ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
