import { useEffect, useState } from "react";
import { API_URL } from "../api";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    ID_CLIENTE: "", NOMBRE: "", TIPO: "", CIUDAD: "",
    DIRECCION: "", CONTACTO: "", TELEFONO: ""
  });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await fetch(`${API_URL}/clientes`);
    const data = await res.json();
    setClientes(data);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId) {
      await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, TELEFONO: Number(form.TELEFONO || 0) })
      });
    } else {
      await fetch(`${API_URL}/clientes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, TELEFONO: Number(form.TELEFONO || 0) })
      });
      setEditId(null);
    }
    setForm({ ID_CLIENTE: "", NOMBRE: "", TIPO: "", CIUDAD: "", DIRECCION: "", CONTACTO: "", TELEFONO: "" });
    await load();
  };

  const handleEdit = (c) => {
    setEditId(c.ID_CLIENTE);
    setForm({
      ID_CLIENTE: c.ID_CLIENTE, NOMBRE: c.NOMBRE, TIPO: c.TIPO ?? "",
      CIUDAD: c.CIUDAD ?? "", DIRECCION: c.DIRECCION ?? "", CONTACTO: c.CONTACTO ?? "",
      TELEFONO: c.TELEFONO ?? ""
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    await fetch(`${API_URL}/clientes/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", fontFamily: "sans-serif" }}>
      <h1>Clientes</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        <input name="ID_CLIENTE" placeholder="ID_CLIENTE" value={form.ID_CLIENTE} onChange={handleChange} disabled={!!editId}/>
        <input name="NOMBRE" placeholder="NOMBRE" value={form.NOMBRE} onChange={handleChange} required />
        <input name="TIPO" placeholder="TIPO" value={form.TIPO} onChange={handleChange} />
        <input name="CIUDAD" placeholder="CIUDAD" value={form.CIUDAD} onChange={handleChange} />
        <input name="DIRECCION" placeholder="DIRECCION" value={form.DIRECCION} onChange={handleChange} />
        <input name="CONTACTO" placeholder="CONTACTO" value={form.CONTACTO} onChange={handleChange} />
        <input name="TELEFONO" placeholder="TELEFONO" value={form.TELEFONO} onChange={handleChange} />
        <button type="submit" style={{ gridColumn: "1 / span 3" }}>{editId ? "Actualizar" : "Crear"} Cliente</button>
      </form>

      <table width="100%" border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Tipo</th><th>Ciudad</th><th>Dirección</th><th>Contacto</th><th>Teléfono</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.ID_CLIENTE}>
              <td>{c.ID_CLIENTE}</td>
              <td>{c.NOMBRE}</td>
              <td>{c.TIPO}</td>
              <td>{c.CIUDAD}</td>
              <td>{c.DIRECCION}</td>
              <td>{c.CONTACTO}</td>
              <td>{c.TELEFONO}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Editar</button>{" "}
                <button onClick={() => handleDelete(c.ID_CLIENTE)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {clientes.length === 0 && (
            <tr><td colSpan="8" align="center">Sin clientes aún</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
