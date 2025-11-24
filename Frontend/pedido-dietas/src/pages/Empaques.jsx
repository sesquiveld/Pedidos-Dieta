import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Pages.css";

const API_URL = "http://localhost:4000/api/empaques";

const Empaques = () => {
  const navigate = useNavigate();
  const [empaques, setEmpaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); 
  const [formData, setFormData] = useState({
    id_empaque:"",
    nombre_empaque: "",
    precio_empaque: "",
    caracteristicas: "",
  })

  useEffect(() => {
    loadEmpaques()
  }, [])

  const loadEmpaques = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setEmpaques(data);
    } catch (error) {
      console.error("Error cargando Empaques:", error);
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
          alert("Empaque actualizada correctamente");
        } else {
          // crear
          await axios.post(API_URL, formData);
          alert("empaque agregada exitosamente");
        }
  
        setFormData({
          id_empaque: "",
          nombre_epaque: "",
          precio_empaque:"",
          caracteristicas:"",
        });
        setShowForm(false);
        setEditing(null);
        loadEmpaques();
      } catch (error) {
        console.error("Error guardando empaque:", error);
        const msg = error.response?.data?.error || error.message;
        alert("Error al guardar empaque: " + msg);
      }
    };

  
    const handleEdit = (empaque) => {
   
    setFormData({
      id_empaque: empaque.id_empaque ?? empaque.ID_EMPAQUE ?? empaque.id_empaque ?? "",
      nombre_empaque: empaque.nombre_empaque ?? empaque.NOMBRE_EMPAQUE ?? "",
      precio: empaque.precio ?? empaque.PRECIO ?? "",
      descripcion: empaque.descripcion ?? empaque.DESCRIPCION ?? "",
    });
    setEditing(empaque.id_empaque ?? empaque.ID_EMPAQUE ?? empaque.id_empaque ?? null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar el empaque?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Empaque eliminado correctamente");
      loadEmpaques();
    } catch (error) {
      console.error("Error eliminando empaque:", error);
      const msg = error.response?.data?.error || error.message;
      alert("Error al eliminar empaque: " + msg);
    }
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="loading">Cargando empaques...</div>
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
        <h1>📦 Gestión de Empaques</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo Empaque"}
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
          <h2>Agregar Nuevo Empaque</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="number"
                name="id_empaque"
                placeholder="Id de  empaque"
                value={formData.id_empaque}
                onChange={handleInputChange}
                required
                disabled={!!editing}
              />
              <input
                type="text"
                name="nombre_empaque"
                placeholder="Nombre empaque"
                value={formData.nombre_empaque}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="precio_empaque"
                placeholder="Precio"
                value={formData.precio_empaque}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="caracteristicas"
                placeholder="Caracteristicas del  empaque"
                value={formData.caracteristicas}
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
                <th>Nombre</th>
                <th>Precio</th>
                <th>Caracteristicas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>


              {empaques.map((empaque) => (
                <tr key={empaque.id_empaque ?? empaque.ID_EMPAQUE ?? empaque.id_empaque}>
                  <td>{empaque.id_empaque ?? empaque.ID_EMPAQUE ?? empaque.ID_EMPAQUE}</td>
                  <td>{empaque.nombre_empaque ?? empaque.NOMBRE_EMPAQUE}</td>
                  <td>{empaque.precio_empaque ?? empaque.PRECIO_EMPAQUE}</td>
                  <td>{empaque.caracteristicas ?? empaque.CARACTERISTICAS}</td>
                  <td>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => handleEdit(empaque)}>Editar</button>
                  </td>
                  <td>  
                    <button className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition" onClick={() => handleDelete(empaque.id_empaque ?? empaque.ID_EMPAQUE ?? empaque.id_empaque)}>Eliminar</button>
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




