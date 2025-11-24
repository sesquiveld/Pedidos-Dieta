import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";
import "./Pages.css";

const API_URL = "http://localhost:4000/api/cliente-dietas";

const ClienteDietas = () => {
  const navigate = useNavigate();
  const [clienteDietas, setClienteDietas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [dietas, setDietas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [editing, setEditing] = useState(null); // { id_cliente, codigo_dieta }
  const [formData, setFormData] = useState({
    id_cliente: "",
    codigo_dieta: "",
    precio: "",
  });

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadClienteDietas();
    loadClientes();
    loadDietas();
  }, []);

  const loadClienteDietas = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setClienteDietas(data);
    } catch (error) {
      console.error("Error cargando cliente-dietas:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadClientes = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/clientes");
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  const loadDietas = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/dietas");
      setDietas(data);
    } catch (error) {
      console.error("Error cargando dietas:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // actualización con PK compuesta
        await axios.put(
          `${API_URL}/${editing.id_cliente}/${editing.codigo_dieta}`,
          { precio: formData.precio }
        );
        setModalMessage("✅ Registro actualizado correctamente");
        setShowModal(true);
        //alert("Registro actualizado correctamente ✅");
      } else {
        // creación
        await axios.post(API_URL, formData);
        setModalMessage("✅ Registro agregado exitosamente");
        setShowModal(true);
        //alert("Registro agregado exitosamente ✅");
      }

      setFormData({ id_cliente: "", codigo_dieta: "", precio: "" });
      setShowForm(false);
      setEditing(null);
      loadClienteDietas();
    } catch (error) {
      console.error("Error guardando cliente-dieta:", error);
      setModalMessage(" ❌ Error al guardar");
      setShowModal(true);
      //alert("Error al guardar ❌");
    }
  };

  const handleEdit = (registro) => {
    setFormData({
      id_cliente: registro.id_cliente,
      codigo_dieta: registro.codigo_dieta,
      precio: registro.precio,
    });
    setEditing({
      id_cliente: registro.id_cliente,
      codigo_dieta: registro.codigo_dieta,
    });
    setShowForm(true);
  };

  const handleDelete = async (id_cliente, codigo_dieta) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;
    try {
      await axios.delete(`${API_URL}/${id_cliente}/${codigo_dieta}`);
      setModalMessage(" ✅ Registro eliminado correctamente");
      setShowModal(true);
      //alert("Registro eliminado correctamente ✅");
      loadClienteDietas();
    } catch (error) {
      console.error("Error eliminando registro:", error);
      setModalMessage("  ❌ Error al eliminar");
      setShowModal(true);
      //alert("Error al eliminar ❌");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="loading">Cargando cliente-dietas...</div>;
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
        <h1>🥗 Cliente - Dietas</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo Registro"}
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
          <h2>{editing ? "Editar Registro" : "Agregar Cliente-Dieta"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <select
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleInputChange}
                required
                disabled={!!editing} // no permitir cambiar cliente en edición
              >
                <option value="">Seleccione Cliente</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              <select
                name="codigo_dieta"
                value={formData.codigo_dieta}
                onChange={handleInputChange}
                required
                disabled={!!editing} // no permitir cambiar dieta en edición
              >
                <option value="">Seleccione Dieta</option>
                {dietas.map((d) => (
                  <option key={d.codigo_dieta} value={d.codigo_dieta}>
                    {d.nombre_dieta}
                  </option>
                ))}
              </select>

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
              {editing ? "Actualizar" : "Guardar"}
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Lista de Registros ({clienteDietas.length})</h2>
        {clienteDietas.length === 0 ? (
          <p className="no-data">No hay registros</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Dieta</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clienteDietas.map((registro) => (
                <tr
                  key={`${registro.id_cliente}-${registro.codigo_dieta}`} // ✅ key compuesta
                >
                  <td>{registro.nombre_cliente}</td>
                  <td>{registro.nombre_dieta}</td>
                  <td>${registro.precio}</td>
                  <td>
                    <button
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                      onClick={() => handleEdit(registro)}
                    >
                      Editar
                    </button>
                   </td>
                   <td> 
                    <button
                      className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                      onClick={() =>
                        handleDelete(
                          registro.id_cliente,
                          registro.codigo_dieta
                        )
                      }
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
      {/* Modal */}
      <Modal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ClienteDietas;


