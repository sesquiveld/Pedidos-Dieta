import { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css";
import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:4000/api/clientes";


const Clientes = () => {
  const navigate = useNavigate();
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
        <h1>👥 Gestión de Clientes</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo Cliente"}
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
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                      onClick={() => handleEdit(cliente)}
                    >
                      Editar
                    </button>
                  </td>
                  <td>  
                    <button
                      className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
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


