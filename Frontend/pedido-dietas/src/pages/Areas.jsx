// Areas.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";
import "./Pages.css";

const API_URL = "http://localhost:4000/api/areas";

const Areas = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // id del area que se edita
  const [formData, setFormData] = useState({
    id_area: "",
    nombre_area: "",
    descripcion: "",
    ubicacion: "",
  });

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const { data } = await axios.get(API_URL);
      //const { data } = await axios.get("/areas");
      setAreas(data);
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
        setModalMessage("✅ Área actualizada correctamente");
        setShowModal(true);
        //alert("Área actualizada correctamente");
      } else {
        // crear
        await axios.post(API_URL, formData);
        setModalMessage("✅ Área agregada exitosamente");
        setShowModal(true);
        //alert("Área agregada exitosamente");
      }

      setFormData({
        id_area: "",
        nombre_area: "",
        descripcion: "",
        ubicacion: "",
      });
      setShowForm(false);
      setEditing(null);
      loadAreas();
    } catch (error) {
      console.error("Error guardando Área:", error);

      // si backend devuelve mensaje útil, mostrarlo
      const msg = error.response?.data?.error || error.message;
      setModalMessage("❌ Error al guardar el área: " + msg);
      setShowModal(true);
      //alert("Error al guardar el área: " + msg);
    }
  };

  const handleEdit = (area) => {
    // Aseguramos que las keys existan con los nombres correctos
    setFormData({
      id_area: area.id_area ?? area.ID_AREA ?? area.id ?? "",
      nombre_area: area.nombre ?? area.NOMBRE_AREA ?? "",
      descripcion: area.descripcion ?? area.DESCRIPCION ?? "",
      ubicacion: area.ubicacion ?? area.UBICACION ?? "",
    });
    // set editing to the primary key the backend expects; aquí asumo id_area
    setEditing(area.id_area ?? area.ID_AREA ?? area.id ?? null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar el área?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setModalMessage("✅ Área eliminada correctamente");
      setShowModal(true);
      //alert("Área eliminada correctamente");
      loadAreas();
    } catch (error) {
      console.error("Error eliminando área:", error);
      const msg = error.response?.data?.error || error.message;
      setModalMessage("❌ Error al eliminar área: " + msg);
      setShowModal(true);
      //alert("Error al eliminar área: " + msg);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="loading">Cargando Áreas...</div>;
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
        <h1>🏢 Gestión de Áreas</h1>
        <button className="btn-primary" onClick={() => { 
                            setShowForm(!showForm); 
                            if (!showForm) {
                              setFormData({ id_area:"", nombre_area:"", descripcion:"", ubicacion:"" }); 
                              setEditing(null); 
                              }
                          }
        }>
          {showForm ? "Cancelar" : "Nueva Área"}
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
          <h2>{editing ? "Editar Área" : "Agregar Nueva Área"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="id_area"
                placeholder="ID Área"
                value={formData.id_area}
                onChange={handleInputChange}
                required
                disabled={!!editing} // No permitir editar la PK
              />
              <input
                type="text"
                name="nombre_area"
                placeholder="Nombre del área"
                value={formData.nombre_area}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación del área"
                value={formData.ubicacion}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción del área"
                value={formData.descripcion}
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
              {areas.map((a) => (
                <tr key={a.id_area ?? a.ID_AREA ?? a.id}>
                  <td>{a.id_area ?? a.ID_AREA ?? a.id}</td>
                  <td>{a.nombre_area ?? a.NOMBRE_AREA}</td>
                  <td>{a.ubicacion ?? a.UBICACION}</td>
                  <td>{a.descripcion ?? a.DESCRIPCION}</td>
                  <td>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => handleEdit(a)}>Editar</button>
                  </td>
                  <td>  
                    <button className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition" onClick={() => handleDelete(a.id_area ?? a.ID_AREA ?? a.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal */}
      <Modal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Areas;



