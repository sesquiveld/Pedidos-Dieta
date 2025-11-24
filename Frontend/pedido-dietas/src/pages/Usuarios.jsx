import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Pages.css";

const API_URL = "http://localhost:4000/api/usuarios";

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    id_usuario: "",
    nombre_usuario: "",
    correo_usuario: "",
    contrasena: "",
    tipo_usuario: "",
    activo: "true",
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing}`, formData);
        alert("Usuario actualizado correctamente");
      } else {
        await axios.post(API_URL, formData);
        alert("Usuario agregado exitosamente");
      }

      setFormData({
        id_usuario: "",
        nombre_usuario: "",
        correo_usuario: "",
        contrasena: "",
        tipo_usuario: "",
        activo: "true",
      });
      setShowForm(false);
      setEditing(null);
      loadUsuarios();
    } catch (error) {
      console.error("Error guardando usuario:", error);
      alert("Error al guardar usuario");
    }
  };

  const handleEdit = (usuario) => {
    setFormData(usuario);
    setEditing(usuario.id_usuario);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Usuario eliminado correctamente");
      loadUsuarios();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert("Error al eliminar usuario");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="loading">Cargando usuarios...</div>;

  const navigateHome = () => {
    const user = JSON.parse(localStorage.getItem("usuario")); // o usa tu contexto si lo tienes
    if (user?.tipo_usuario === "Administrador") {
       navigate("/home-admin");
     } else {
    navigate("/home-user");
    }
};

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 Gestión de Usuarios</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo Usuario"}
        </button>
        <button
            type="button"
            onClick={navigateHome}
            className="bg-blue-400 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            🔙 Volver al inicio
          </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editing ? "Editar Usuario" : "Agregar Nuevo Usuario"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="id_usuario"
                placeholder="ID Usuario"
                value={formData.id_usuario}
                onChange={handleInputChange}
                required
                disabled={editing}
              />
              <input
                type="text"
                name="nombre_usuario"
                placeholder="Nombre"
                value={formData.nombre_usuario}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="correo_usuario"
                placeholder="Correo"
                value={formData.correo_usuario}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="contrasena"
                placeholder="Contraseña"
                value={formData.contrasena}
                onChange={handleInputChange}
              />
              <select
                name="tipo_usuario"
                value={formData.tipo_usuario}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Usuario">Usuario</option>
              </select>
              <select
                name="ACTIVO"
                value={formData.ACTIVO ? "true" : "false"}
                onChange={(e) =>
                  setFormData({ ...formData, ACTIVO: e.target.value === "true" })
                }
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <button type="submit" className="btn-success">
              {editing ? "Actualizar" : "Guardar"}
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
                <th>Correo</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.nombre_usuario}</td>
                  <td>{usuario.correo_usuario}</td>
                  <td>{usuario.tipo_usuario}</td>
                  <td>{usuario.ACTIVO ? "Sí" : "No"}</td>
                  <td>
                    
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => handleEdit(usuario)}>
                      Editar
                    </button>
                  </td>
                  <td>
                    <button
                      className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                      onClick={() => handleDelete(usuario.id_usuario)}
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

export default Usuarios;


/*import { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css";

const API_URL = "http://localhost:4000/api/usuarios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    id_usuario: "",
    nombre_usuario: "",
    correo_usuario: "",
    tipo_usuario: "",
    contrasena:"",
    activo: true,
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {

     try {
      const { data } = await axios.get(API_URL);
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando Usuarios:", error);
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
        alert("Usuario actualizada correctamente");
      } else {
        // crear
        await axios.post(API_URL, formData);
        alert("Usuario agregada exitosamente");
      }

    
      setFormData({
        id_usuario: "",
        nombre_usuario: "",
        correo_usuario: "",
        tipo_usuario: "",
        contrasena:"",
      });
      setShowForm(false);
      setEditing(false);
      loadUsuarios();
    } catch (error) {
      console.error("Error guardando usuario:", error);
      alert("Error al guardar usuario");
    }
  };

  const handleEdit = (usuario) => {
    setFormData(usuario);
    setShowForm(true);
    setEditing(true);
  };

  const handleDelete = async (id_usuario) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
      try {
        await axios.delete(`${API_URL}/${id_usuario}`);
        alert("Usuario eliminado correctamente");
        loadUsuarios();
      } catch (error) {
        console.error("Error eliminando cliente:", error);
        alert("Error al eliminar Usuario");
     }
    };


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="loading">Cargando usuarios...</div>;

  return (
  
      

    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4"></form>
      <div className="page-header">
        <h1>👤 Gestión de Usuarios</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditing(false);
            setFormData({
              id_usuario: "",
              nombre_usuario: "",
              correo_usuario: "",
              tipo_usuario: "",
              contrasena:"",
              activo: "",
            });
          }}
        >
          {showForm ? "Cancelar" : "Nuevo Usuario"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editing ? "Editar Usuario" : "Agregar Nuevo Usuario"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="id_usuario"
                placeholder="Cédula"
                value={formData.id_usuario}
                onChange={handleInputChange}
                required
                disabled={editing} // 👈 no dejar editar ID al modificar
              />
              <input
                type="text"
                name="nombre_usuario"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="correo_usuario"
                placeholder="Email"
                value={formData.correo_usuario}
                onChange={handleInputChange}
                required
              />
              <select
                name="tipo_usuario"
                value={formData.tipo_usuario}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar rol</option>
                <option value="admin">Administrador</option>
                <option value="nutricionista">Nutricionista</option>
                <option value="cocina">Personal de Cocina</option>
                <option value="enfermeria">Enfermería</option>
                <option value="usuario">Usuario</option>
              </select>
              <input
                type="password"
                name="contrasena"
                placeholder="password"
                value={formData.contrasena}
                onChange={handleInputChange}
              />
            
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              {editing ? "Actualizar" : "Guardar"}
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
                <th>Contrasena</th>
                <th>Tipo</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.nombre_usuario}</td>
                  <td>{usuario.correo_usuario}</td>
                  <td>{usuario.contrasena}</td>
                  <td>{usuario.tipo_usuario}</td>
                  <td>{usuario.activo}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(usuario)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(usuario.id_usuario)}
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

export default Usuarios;
*/
/************************************************************************************** */
 /* <select
                type="boolean"
                name="activo"
                value={formData.activo}
                onChange={handleInputChange}
                required
              ></select>
*/

/******************************************************* */
/*
//"use client"

import { useState, useEffect } from "react"
import "./Pages.css"

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    id_usuario:"",
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
        setFormData({ id_usaurio: "", nombre: "", email: "", rol: "", telefono: "" })
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
                name="id_usuario"
                placeholder="Cedula"
                value={formData.id_usuario}
                onChange={handleInputChange}
                required
              />
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
                <option value="usuario">Usuario</option>
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
*/