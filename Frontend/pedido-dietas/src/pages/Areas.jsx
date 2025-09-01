import { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css";

const API_URL = "http://localhost:4000/api/clientes";

const Areas = () => {
  const [Area, setArea] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // id del cliente que se edita
  const [formData, setFormData] = useState({
    id_Are: "",
    nombre: "",
    descripcion: "",
    ubicacion: "",
  });

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setArea(data);
    } catch (error) {
      console.error("Error cargando Areas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // actualizar
        await axios.put(`${API_URL}/${editing}`, formData);
        alert("Area actualizado correctamente");
      } else {
        // crear
        await axios.post(API_URL, formData);
        alert("Area agregada exitosamente");
      }

      setFormData({
        id_area: "",
        nombre_area: "",
        ubicacion: "",
        descripcion: "",
        
      });
      setShowForm(false);
      setEditing(null);
      loadAreas();
    } catch (error) {
      console.error("Error guardando Area:", error);
      alert("Error al guardar el Area");
    }
  };
/*
  const handleEdit = (area) => {
    setFormData(area);
    setEditing(area.id_area);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar el area?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Area eliminado correctamente");
      loadAreas();
    } catch (error) {
      console.error("Error eliminando el area:", error);
      alert("Error al eliminar area");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
*/
  if (loading) {
    return <div className="loading">Cargando Areas...</div>;
  }


  return (
    <div className="page-container">
      <h1>🏢 Gestión de Áreas</h1>
      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Nueva Área"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del área"
            value={formData.nombre}
            onChange={(e) => setFormData({ nombre: e.target.value })}
            required
          />
          <button type="submit" className="btn-success">Guardar</button>
        </form>
      )}

      <div className="table-container">
        <h2>Lista de Áreas ({Areas.length})</h2>
        <table className="data-table">
          <thead>
            <tr><th>ID</th>
            <th>Nombre</th></tr>
          </thead>
          <tbody>
            {Areas.map((a) => (
              <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Areas




/*import { useEffect, useState } from "react";
import { listarAreas, crearArea } from "../services/catalogosService.js";

export default function Areas() {
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({ ID_AREA: "", NOMBRE_AREA: "" , DESCRIPCION:"", UBICACION:""});

  useEffect(() => { listarAreas().then(setAreas); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await crearArea({ ID_AREA: Number(form.ID_AREA), NOMBRE_AREA: form.NOMBRE_AREA });
    setAreas(await listarAreas());
    setForm({ ID_AREA: "", NOMBRE_AREA: "" });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Áreas</h2>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8 }}>
        <input placeholder="ID_AREA" value={form.ID_AREA} onChange={e=>setForm({...form, ID_AREA: e.target.value})}/>
        <input placeholder="NOMBRE_AREA" value={form.NOMBRE_AREA} onChange={e=>setForm({...form, NOMBRE_AREA: e.target.value})}/>
         <input placeholder="DESCRIPCION" value={form.NOMBRE_AREA} onChange={e=>setForm({...form, DESCRIPCION: e.target.value})}/>
          <input placeholder="UBICACION" value={form.NOMBRE_AREA} onChange={e=>setForm({...form, UBICACION: e.target.value})}/>
        <button>Agregar</button>
      </form>
      <ul>
        {areas.map(a => <li key={a.ID_AREA}>{a.ID_AREA} — {a.NOMBRE_AREA}</li>)}
      </ul>
    </div>
  );
}

*/

/*

"use client"

import { useState, useEffect } from "react"
import "./Pages.css"

const Areas = () => {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
  })

  useEffect(() => {
    loadAreas()
  }, [])

  const loadAreas = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/areas")
      if (response.ok) {
        const data = await response.json()
        setAreas(data)
      }
    } catch (error) {
      console.error("Error loading areas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:4000/api/areas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ nombre: "", descripcion: "", ubicacion: "" })
        setShowForm(false)
        loadAreas()
        alert("Área agregada exitosamente")
      }
    } catch (error) {
      console.error("Error adding area:", error)
      alert("Error al agregar área")
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="loading">Cargando áreas...</div>
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏢 Gestión de Áreas</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nueva Área"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Agregar Nueva Área</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del área"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación"
                value={formData.ubicacion}
                onChange={handleInputChange}
              />
              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            <button type="submit" className="btn-success">
              Guardar Área
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Lista de Áreas ({areas.length})</h2>
        {areas.length === 0 ? (
          <p className="no-data">No hay áreas registradas</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id}>
                  <td>{area.id}</td>
                  <td>{area.nombre}</td>
                  <td>{area.ubicacion}</td>
                  <td>{area.descripcion}</td>
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

export default Areas

*/