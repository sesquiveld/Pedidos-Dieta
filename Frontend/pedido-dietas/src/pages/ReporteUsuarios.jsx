import {  useState } from "react";
import { reportPorUsuario } from "../services/reportService.js";

export default function ReportesUsuarios() {
  const [reporte, setReporte] = useState([]);
  const [filtro, setFiltro] = useState({
    desde: "",
    hasta: "",
  });

  const handleBuscar = async () => {
    const data = await reportPorUsuario(filtro.desde, filtro.hasta);
    setReporte(data);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>📊 Reporte de Pedidos por Usuario</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="date"
          value={filtro.desde}
          onChange={(e) => setFiltro({ ...filtro, desde: e.target.value })}
        />
        <input
          type="date"
          value={filtro.hasta}
          onChange={(e) => setFiltro({ ...filtro, hasta: e.target.value })}
        />
        <button onClick={handleBuscar}>Buscar</button>
      </div>

      {reporte.length === 0 ? (
        <p>No hay datos para mostrar</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID Usuario</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Total Pedidos</th>
              <th>Total Dietas</th>
              <th>Total Empaques</th>
            </tr>
          </thead>
          <tbody>
            {reporte.map((r) => (
              <tr key={r.id_usuario}>
                <td>{r.id_usuario}</td>
                <td>{r.nombre_usuario}</td>
                <td>{r.tipo_usuario}</td>
                <td>{r.totalPedidos}</td>
                <td>{r.totalDietas}</td>
                <td>{r.totalEmpaques}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
