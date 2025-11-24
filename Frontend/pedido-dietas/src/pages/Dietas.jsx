// Dietas.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Pages.css";

const API_URL = "http://localhost:4000/api/dietas";

const Dietas = () => {
  const navigate = useNavigate();
  const [dietas, setDietas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); 
  const [formData, setFormData] = useState({
    codigo_dieta: "",
    nombre_dieta: "",
  });

  useEffect(() => {
    loadDietas();
  }, []);

  const loadDietas = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setDietas(data);
    } catch (error) {
      console.error("Error cargando Dietas:", error);
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
        alert("Dieta actualizada correctamente");
      } else {
        // crear
        await axios.post(API_URL, formData);
        alert("Dieta agregada exitosamente");
      }

      setFormData({
        codigo_dieta: "",
        nombre_dieta: "",
      });
      setShowForm(false);
      setEditing(null);
      loadDietas();
    } catch (error) {
      console.error("Error guardando dieta:", error);
      const msg = error.response?.data?.error || error.message;
      alert("Error al guardar dieta: " + msg);
    }
  };

  const handleEdit = (dieta) => {
    setFormData({
      codigo_dieta: dieta.codigo_dieta ?? dieta.CODIGO_DIETA ?? dieta.codigo ?? "",
      nombre_dieta: dieta.nombre_dieta ?? <dieta className="NOMBRE_DIETA"></dieta> ?? "",
    });
    setEditing(dieta.codigo_dieta ?? dieta.CODIGO_DIETA ?? dieta.codigo ?? null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta dieta?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Dieta eliminada correctamente");
      loadDietas();
    } catch (error) {
      console.error("Error eliminando dieta:", error);
      const msg = error.response?.data?.error || error.message;
      alert("Error al eliminar dieta: " + msg);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="loading">Cargando tipos de dieta...</div>;
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
        <h1>🍽️ Tipos de Dieta</h1>
        <button className="btn-primary" onClick={() => 
            { setShowForm(!showForm); 
            if (!showForm) { 
              setFormData({ codigo_dieta:"", nombre_dieta:"" }); 
              setEditing(null);
             }
            }
          }
        >
          {showForm ? "Cancelar" : "Nueva Dieta"}
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
          <h2>{editing ? "Editar Dieta" : "Agregar Nueva Dieta"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="codigo_dieta"
                placeholder="Código Dieta"
                value={formData.codigo_dieta}
                onChange={handleInputChange}
                required
                disabled={!!editing}
              />
              <input
                type="text"
                name="nombre_dieta"
                placeholder="Nombre de la dieta"
                value={formData.nombre_dieta}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn-success">
              {editing ? "Actualizar" : "Guardar"}
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Lista de Dietas ({dietas.length})</h2>
        {dietas.length === 0 ? (
          <p className="no-data">No hay dietas registradas</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dietas.map((dieta) => (
                <tr key={dieta.codigo_dieta ?? dieta.CODIGO_DIETA ?? dieta.codigo}>
                  <td>{dieta.codigo_dieta ?? dieta.CODIGO_DIETA ?? dieta.codigo}</td>
                  <td>{dieta.nombre_dieta ?? dieta.nombre_dieta}</td>
                  <td>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => handleEdit(dieta)}>
                      Editar
                    </button>
                  </td>
                  <td>  
                    <button className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition" onClick={() => handleDelete(dieta.codigo_dieta ?? dieta.CODIGO_DIETA ?? dieta.codigo)}>
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

export default Dietas;



