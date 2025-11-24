import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:4000/api";

export default function FacturaCliente() {
  const [clientes, setClientes] = useState([]);
  const [idCliente, setIdCliente] = useState("");
  const [desde, setDesde] = useState(new Date().toISOString().slice(0, 10));
  const [hasta, setHasta] = useState(new Date().toISOString().slice(0, 10));
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${API}/clientes`);
      setClientes(data);
    })();
  }, []);

  const generarFactura = async () => {
    const { data } = await axios.get(`${API}/pedidos/factura/cliente`, {
      params: { id_cliente: idCliente, desde, hasta },
    });
    setResumen(data);
  };

  const handlePrint = () => window.print();

  return (
    <div className="page-container">
      <h1>🧾 Facturación por Cliente</h1>
      <div className="form-grid">
        <label>
          Cliente:
          <select value={idCliente} onChange={(e) => setIdCliente(e.target.value)}>
            <option value="">-- Seleccione --</option>
            {clientes.map((c) => (
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Desde:
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </label>
        <label>
          Hasta:
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </label>
      </div>
      <button onClick={generarFactura} className="btn-primary">Generar</button>

      {resumen && (
        <div className="factura">
          <h2>Factura</h2>
          {Object.entries(resumen).map(([fecha, areas]) => (
            <div key={fecha}>
              <h3>📅 {fecha}</h3>
              {Object.entries(areas).map(([area, valores]) => (
                <div key={area}>
                  <h4>Área: {area}</h4>
                  <p><b>Dietas:</b></p>
                  <ul>
                    {Object.entries(valores.dietas).map(([nombre, cant]) => (
                      <li key={nombre}>{nombre}: {cant}</li>
                    ))}
                  </ul>
                  <p><b>Empaques:</b></p>
                  <ul>
                    {Object.entries(valores.empaques).map(([nombre, subtotal]) => (
                      <li key={nombre}>{nombre}: ${subtotal.toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
          <button onClick={handlePrint} className="btn-success">Imprimir Factura</button>
        </div>
      )}
    </div>
  );
}
