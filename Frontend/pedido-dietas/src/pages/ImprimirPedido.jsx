import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000/api";

export default function ImprimirPedido() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${API}/pedidos/${id}/print`);
      setPedido(data);
    })();
  }, [id]);

  const handlePrint = () => window.print();

  if (!pedido) return <p>Cargando pedido...</p>;

  return (
    <div className="print-container">
      <h1>🧾 Pedido #{pedido.id_pedido}</h1>
      <p>Cliente: {pedido.Cliente?.nombre}</p>
      <p>Área: {pedido.Area?.nombre_area}</p>
      <p>Fecha: {pedido.fecha}</p>
      <hr />
      <h2>Dietas</h2>
      <ul>
        {pedido.Dietas.map((d) => (
          <li key={d.codigo_dieta}>
            {d.nombre} × {d.PedidoDieta.cantidad}
          </li>
        ))}
      </ul>
      <h2>Empaques</h2>
      <ul>
        {pedido.Empaques.map((e) => (
          <li key={e.id_empaque}>
            {e.nombre_empaque} × {e.PedidoEmpaque.cantidad}
          </li>
        ))}
      </ul>
      <button onClick={handlePrint} className="btn-primary">Imprimir</button>
    </div>
  );
}
