import { useState, useEffect } from "react"
import { getEmpaques, createEmpaque } from "../services/catalogosService"
import "./Pages.css"

const Empaques = () => {
  const [empaques, setEmpaques] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
  })

  useEffect(() => {
    loadEmpaques()
  }, [])

  const loadEmpaques = async () => {
    try {
      const data = await getEmpaques()
      setEmpaques(data)
    } catch (error) {
      console.error("Error cargando empaques:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createEmpaque(formData)
      setFormData({ nombre: "", precio: "" })
      setShowForm(false)
      loadEmpaques()
      alert("✅ Empaque agregado exitosamente")
    } catch (error) {
      console.error("Error agregando empaque:", error)
      alert("❌ Error al agregar empaque")
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="loading">Cargando empaques...</div>
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Gestión de Empaques</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo Empaque"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Agregar Nuevo Empaque</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre empaque"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn-success">
              Guardar Empaque
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Lista de Empaques ({empaques.length})</h2>
        {empaques.length === 0 ? (
          <p className="no-data">No hay empaques registrados</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empaques.map((empaque) => (
                <tr key={empaque.id}>
                  <td>{empaque.id}</td>
                  <td>{empaque.nombre}</td>
                  <td>{empaque.precio}</td>
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

export default Empaques






/*import { useEffect, useState } from "react";
import { listarEmpaques, crearEmpaque } from "../services/catalogosService";

export default function Empaques() {
  const [empaques, setEmpaques] = useState([]);
  const [form, setForm] = useState({ ID_EMPAQUE: "", NOMBRE_EMPAQUE: "" });

  useEffect(() => { listarEmpaques().then(setEmpaques); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await crearEmpaque({ ID_EMPAQUE: Number(form.ID_EMPAQUE), NOMBRE_EMPAQue: form.NOMBRE_EMPAQUE });
    setEmpaques(await listarEmpaques());
    setForm({ ID_EMPAQUE: "", NOMBRE_EMPAQUE: "" });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Empaques</h2>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8 }}>
        <input placeholder="ID_EMPAQUE" value={form.ID_EMPAQUE} onChange={e=>setForm({...form, ID_EMPAQUE: e.target.value})}/>
        <input placeholder="NOMBRE_EMPAQUE" value={form.NOMBRE_EMPAQUE} onChange={e=>setForm({...form, NOMBRE_EMPAQUE: e.target.value})}/>
        <button>Agregar</button>
      </form>
      <ul>
        {empaques.map(a => <li key={a.ID_EMPAQUE}>{a.ID_EMPAQUE} — {a.NOMBRE_EMPAQUE}</li>)}
      </ul>
    </div>
  );
}

*/

/*
"use client"

import { useState, useEffect } from "react"
import "./Pages.css"

const Empaques = () => {
  const [empaques, setEmpaques] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
  })

  useEffect(() => {
    loadEmpaques()
  }, [])

  const loadEmpaques = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/empaques")
      if (response.ok) {
        const data = await response.json()
        setEmpaques(data)
      }
    } catch (error) {
      console.error("Error loading empaques:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/api/empaques", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ tipo: "", descripcion: "", capacidad: "", material: "" })
        setShowForm(false)
        loadEmpaques()
        alert("Empaque agregado exitosamente")
      }
    } catch (error) {
      console.error("Error adding empaque:", error)
      alert("Error al agregar empaque")
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="loading">Cargando empaques...</div>
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Gestión de Empaques</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo Empaque"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Agregar Nuevo Empaque</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre empaque"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="int"
                name="precio"
                placeholder="Precio"
                value={formData.precio}
                onChange={handleInputChange}
              />
              
            </div>
            <button type="submit" className="btn-success">
              Guardar Empaque
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Lista de Empaques ({empaques.length})</h2>
        {empaques.length === 0 ? (
          <p className="no-data">No hay empaques registrados</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>nombre</th>
                <th>precio</th>
              </tr>
            </thead>
            <tbody>
              {empaques.map((empaque) => (
                <tr key={empaque.id}>
                  <td>{empaque.id}</td>
                  <td>{empaque.nombtr}</td>
                  <td>{empaque.precio}</td>
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

export default Empaques
*/