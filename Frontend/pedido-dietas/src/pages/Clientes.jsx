import { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css";

const API_URL = "http://localhost:4000/api/clientes";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // id del cliente que se edita
  const [formData, setFormData] = useState({
    id_cliente: "",
    nombre: "",
    tipo: "",
    ciudad: "",
    direccion: "",
    contacto: "",
    telefono: "",
    correo: "",
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
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
        alert("Cliente actualizado correctamente");
      } else {
        // crear
        await axios.post(API_URL, formData);
        alert("Cliente agregado exitosamente");
      }

      setFormData({
        id_cliente: "",
        nombre: "",
        tipo: "",
        ciudad: "",
        direccion: "",
        contacto: "",
        telefono: "",
        correo: "",
      });
      setShowForm(false);
      setEditing(null);
      loadClientes();
    } catch (error) {
      console.error("Error guardando cliente:", error);
      alert("Error al guardar cliente");
    }
  };

  const handleEdit = (cliente) => {
    setFormData(cliente);
    setEditing(cliente.id_cliente);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Cliente eliminado correctamente");
      loadClientes();
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      alert("Error al eliminar cliente");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="loading">Cargando clientes...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👥 Gestión de Clientes</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo Cliente"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editing ? "Editar Cliente" : "Agregar Nuevo Cliente"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="id_cliente"
                placeholder="ID Cliente"
                value={formData.id_cliente}
                onChange={handleInputChange}
                required
                disabled={editing} // No permitir editar la PK
              />
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="tipo"
                placeholder="Tipo"
                value={formData.tipo}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="contacto"
                placeholder="Contacto"
                value={formData.contacto}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="correo"
                placeholder="Correo"
                value={formData.correo}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn-success">
              {editing ? "Actualizar" : "Guardar"}
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Lista de Clientes ({clientes.length})</h2>
        {clientes.length === 0 ? (
          <p className="no-data">No hay clientes registrados</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Ciudad</th>
                <th>Dirección</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.id_cliente}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.tipo}</td>
                  <td>{cliente.ciudad}</td>
                  <td>{cliente.direccion}</td>
                  <td>{cliente.contacto}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.correo}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(cliente)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(cliente.id_cliente)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Clientes;



/*
"use client"

import { useState, useEffect } from "react"
import "./Pages.css"

const Clientes = () => {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    id_cliente: "",
    nombre: "",
    tipo : "",
    ciudad: "",
    direccion: "",
    contacto: "",
    telefono: "",
    correo:""
  })

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/clientes")
      if (response.ok) {
        const data = await response.json()
        setClientes(data)
      }
    } catch (error) {
      console.error("Error loading clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          id_cliente: "",
          nombre: "",
          tipo: "",
          ciudad: "",
          direccion: "",
          contacto: "",
          telefono: "",
          correo:"",
        })
        setShowForm(false)
        loadClientes()
        alert("Cliente agregado exitosamente")
      }
    } catch (error) {
      console.error("Error adding cliente:", error)
      alert("Error al agregar cliente")
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="loading">Cargando clientes...</div>
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👥 Gestión de Clientes</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo Cliente"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Agregar Nuevo Cliente</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="id_cliente"
                placeholder="id_cliente"
                value={formData.id_cliente}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="nombre"
                placeholder="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="tipo"
                placeholder="Tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="direccion"
                placeholder="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="contacto"
                placeholder="Contacto"
                value={formData.contacto}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="correo"
                placeholder="Email"
                value={formData.correo}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn-success">
              Guardar Cliente
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Lista de Clientes ({clientes.length})</h2>
        {clientes.length === 0 ? (
          <p className="no-data">No hay clientes registrados</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Ciudad</th>
                <th>Direccion</th>
                <th>Contacto</th>
                <th>Telefono</th>
                <th>E-Mail</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id_Cliente}>
                  <td>{cliente.id_cliente}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.tipo}</td>
                  <td>{cliente.ciudad}</td>
                  <td>{cliente.direccion}</td>
                  <td>{cliente.contacto}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.email}</td>
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

export default Clientes
*/