//"use client"

import { useState, useEffect } from "react"
import "./Pages.css"

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "",
    telefono: "",
  })

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios")
      if (response.ok) {
        const data = await response.json()
        setUsuarios(data)
      }
    } catch (error) {
      console.error("Error loading usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ nombre: "", email: "", rol: "", telefono: "" })
        setShowForm(false)
        loadUsuarios()
        alert("Usuario agregado exitosamente")
      }
    } catch (error) {
      console.error("Error adding usuario:", error)
      alert("Error al agregar usuario")
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 Gestión de Usuarios</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo Usuario"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Agregar Nuevo Usuario</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <select name="rol" value={formData.rol} onChange={handleInputChange} required>
                <option value="">Seleccionar rol</option>
                <option value="admin">Administrador</option>
                <option value="nutricionista">Nutricionista</option>
                <option value="cocina">Personal de Cocina</option>
                <option value="enfermeria">Enfermería</option>
              </select>
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn-success">
              Guardar Usuario
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Lista de Usuarios ({usuarios.length})</h2>
        {usuarios.length === 0 ? (
          <p className="no-data">No hay usuarios registrados</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                  <td>{usuario.telefono}</td>
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

export default Usuarios
