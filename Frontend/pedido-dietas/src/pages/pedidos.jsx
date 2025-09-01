import { useEffect, useState } from "react";
import { getCliente } from "../services/clienteService.js";
import { getAreas, getDietas, getEmpaques } from "../services/catalogosService.js";
import { getPedidos,createPedido } from "../services/pedidoService.js";

export default function Pedidos() {
  const [clientes, setClientes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [dietas, setDietas] = useState([]);
  const [empaques, setEmpaques] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [form, setForm] = useState({
    id_cliente: "",
    id_area: "",
    id_usuario: "",
    tipo_comida: "Desayuno",
    fecha: new Date().toISOString().slice(0,10),
    observaciones: "",
    dietas: [],    // [{ codigo_dieta, cantidad }]
    empaques: [],  // [{ id_empaque, cantidad }]
  });

  useEffect(() => {
    (async () => {
      setClientes(await getCliente());
      setAreas(await getAreas());
      setDietas(await getDietas());
      setEmpaques(await getEmpaques());
      setPedidos(await getPedidos());
    })();
  }, []);

  const addDieta = () => setForm(f => ({ ...f, dietas: [...f.dietas, { codigo_dieta: "", cantidad: 1 }] }));
  const updDieta = (i, key, val) => {
    const copy = [...form.dietas]; copy[i] = { ...copy[i], [key]: val }; setForm({ ...form, dietas: copy });
  };
  const delDieta = (i) => setForm(f => ({ ...f, dietas: f.dietas.filter((_,idx)=>idx!==i) }));

  const addEmpaque = () => setForm(f => ({ ...f, empaques: [...f.empaques, { id_empaque: "", cantidad: 1 }] }));
  const updEmpaque = (i, key, val) => {
    const copy = [...form.empaques]; copy[i] = { ...copy[i], [key]: val }; setForm({ ...form, empaques: copy });
  };
  const delEmpaque = (i) => setForm(f => ({ ...f, empaques: f.empaques.filter((_,idx)=>idx!==i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPedido(form);
    setPedidos(await getPedidos());
    // limpiar
    setForm(f => ({ ...f, OBSERVACIONES: "", dietas: [], empaques: [] }));
    alert("Pedido creado");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Crear Pedido</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 700 }}>
        <label>
          Cliente:
          <select value={form.id_cliente} onChange={e=>setForm({...form, id_cliente: e.target.value})} required>
            <option value="">-- Seleccione --</option>
            {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
          </select>
        </label>

        <label>
          Área:
          <select value={form.id_area} onChange={e=>setForm({...form, id_area: Number(e.target.value)})} required>
            <option value="">-- Seleccione --</option>
            {areas.map(a => <option key={a.id_area} value={a.id_area}>{a.nombre_area}</option>)}
          </select>
        </label>

        <label>
          Tipo de comida:
          <select value={form.tipo_comida} onChange={e=>setForm({...form, tipo_comida: e.target.value})}>
            <option>Desayuno</option>
            <option>Almuerzo</option>
            <option>Comida</option>
            <option>Merienda</option>
          </select>
        </label>

        <label>
          Fecha:
          <input type="date" value={form.fecha} onChange={e=>setForm({...form, fecha: e.target.value})} required />
        </label>

        <label>
          Observaciones:
          <input value={form.observaciones} onChange={e=>setForm({...form, observaciones: e.target.value})} />
        </label>

        <div>
          <h3>Dietas</h3>
          {form.dietas.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <select value={d.CODIGO_DIETA} onChange={e=>updDieta(i, "codigo_dieta", Number(e.target.value))} required>
                <option value="">-- Dieta --</option>
                {dietas.map(di => <option key={di.codigo_dieta} value={di.codigo_dieta}>{di.nombre_dieta}</option>)}
              </select>
              <input type="number" min="1" value={d.cantidad} onChange={e=>updDieta(i, "CANTIDAD", Number(e.target.value))} />
              <button type="button" onClick={()=>delDieta(i)}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={addDieta}>+ Agregar dieta</button>
        </div>

        <div>
          <h3>Empaques</h3>
          {form.empaques.map((em, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <select value={em.ID_EMPAQUE} onChange={e=>updEmpaque(i, "id_empaque", Number(e.target.value))} required>
                <option value="">-- Empaque --</option>
                {empaques.map(ep => <option key={ep.id_empaque} value={ep.id_empaque}>{ep.nombre_empaque}</option>)}
              </select>
              <input type="number" min="1" value={em.cantidad} onChange={e=>updEmpaque(i, "CANTIDAD", Number(e.target.value))} />
              <button type="button" onClick={()=>delEmpaque(i)}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={addEmpaque}>+ Agregar empaque</button>
        </div>

        <button type="submit">Guardar Pedido</button>
      </form>

      <hr style={{ margin: "24px 0" }} />

      <h2>Pedidos recientes</h2>
      <ul>
        {pedidos.map(p => (
          <li key={p.id_pedido}>
            #{p.id_pedido} — {p.fecha} — {p.tipo_comida} — {p.Cliente?.nombre} / {p.Area?.nombre_area}
          </li>
        ))}
      </ul>
    </div>
  );
}



/*"use client"

import { useState, useEffect } from "react"
import "./Pages.css"

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    cliente_id: "",
    area_id: "",
    tipo_dieta: "",
    observaciones: "",
    fecha_entrega: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [pedidosRes, clientesRes, areasRes] = await Promise.all([
        fetch("http://localhost:3000/api/pedidos"),
        fetch("http://localhost:3000/api/clientes"),
        fetch("http://localhost:3000/api/areas"),
      ])

      if (pedidosRes.ok) {
        const pedidosData = await pedidosRes.json()
        setPedidos(pedidosData)
      }
      if (clientesRes.ok) {
        const clientesData = await clientesRes.json()
        setClientes(clientesData)
      }
      if (areasRes.ok) {
        const areasData = await areasRes.json()
        setAreas(areasData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          cliente_id: "",
          area_id: "",
          tipo_dieta: "",
          observaciones: "",
          fecha_entrega: "",
        })
        setShowForm(false)
        loadData()
        alert("Pedido agregado exitosamente")
      }
    } catch (error) {
      console.error("Error adding pedido:", error)
      alert("Error al agregar pedido")
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📋 Gestión de Pedidos</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo Pedido"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Crear Nuevo Pedido</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <select name="cliente_id" value={formData.cliente_id} onChange={handleInputChange} required>
                <option value="">Seleccionar cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>

              <select name="area_id" value={formData.area_id} onChange={handleInputChange} required>
                <option value="">Seleccionar área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
              </select>

              <select name="tipo_dieta" value={formData.tipo_dieta} onChange={handleInputChange} required>
                <option value="">Tipo de dieta</option>
                <option value="normal">Normal</option>
                <option value="blanda">Blanda</option>
                <option value="liquida">Líquida</option>
                <option value="diabetica">Diabética</option>
                <option value="hiposodica">Hiposódica</option>
                <option value="vegetariana">Vegetariana</option>
              </select>

              <input
                type="datetime-local"
                name="fecha_entrega"
                value={formData.fecha_entrega}
                onChange={handleInputChange}
                required
              />

              <textarea
                name="observaciones"
                placeholder="Observaciones especiales"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            <button type="submit" className="btn-success">
              Crear Pedido
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Lista de Pedidos ({pedidos.length})</h2>
        {pedidos.length === 0 ? (
          <p className="no-data">No hay pedidos registrados</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Área</th>
                <th>Tipo Dieta</th>
                <th>Fecha Entrega</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{pedido.cliente_nombre}</td>
                  <td>{pedido.area_nombre}</td>
                  <td>{pedido.tipo_dieta}</td>
                  <td>{new Date(pedido.fecha_entrega).toLocaleString()}</td>
                  <td>
                    <span className={`status ${pedido.estado}`}>{pedido.estado}</span>
                  </td>
                  <td>
                    <button className="btn-edit">Editar</button>
                    <button className="btn-delete">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Pedidos
*/