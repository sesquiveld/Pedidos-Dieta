import { useState, useEffect } from "react";
import axios from "axios";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ ID_CLIENTE: "", NOMBRE: "", CIUDAD: "" });

  useEffect(() => {
    axios.get("http://localhost:4000/api/clientes").then((res) => setClientes(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/api/clientes", form);
    setForm({ ID_CLIENTE: "", NOMBRE: "", CIUDAD: "" });
    const res = await axios.get("http://localhost:4000/api/clientes");
    setClientes(res.data);
  };

  return (
    <div>
      <h1>Gestión de Clientes</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="ID Cliente" value={form.ID_CLIENTE} 
               onChange={(e) => setForm({ ...form, ID_CLIENTE: e.target.value })} />
        <input placeholder="Nombre" value={form.NOMBRE} 
               onChange={(e) => setForm({ ...form, NOMBRE: e.target.value })} />
        <input placeholder="Ciudad" value={form.CIUDAD} 
               onChange={(e) => setForm({ ...form, CIUDAD: e.target.value })} />
        <button type="submit">Agregar</button>
      </form>

      <ul>
        {clientes.map((c) => (
          <li key={c.ID_CLIENTE}>{c.NOMBRE} - {c.CIUDAD}</li>
        ))}
      </ul>
    </div>
  );
}

export default Clientes;
