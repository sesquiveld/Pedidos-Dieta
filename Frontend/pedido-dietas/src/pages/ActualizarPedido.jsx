// src/pages/ActualizarPedido.jsx
import { useEffect, useState } from "react";
//useLocation,
import {  useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Modal from "../components/Modal";

const ActualizarPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
 // const location = useLocation();

  const [pedido, setPedido] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [dietasCatalogo, setDietasCatalogo] = useState([]);
  const [empaquesCatalogo, setEmpaquesCatalogo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
   const [mensaje, setMensaje] = useState("");
   const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarCatalogos();
   // cargarPedido();
  }, [id]);
/*
   useEffect(() => {
  if (pedido.estado_pedido === "Listo") {
    // Solo permitir cambio a cancelado
    setEditableFields(["estado_pedido"]);
  } else if (pedido.estado_pedido === "Cancelado") {
    setEditableFields([]); // Solo lectura
  } else {
    setEditableFields(["todos"]);
  }
}, [pedido]);*/


  const cargarCatalogos = async () => {
    try {
      //clientesRes,
      const [ pedidoRes, clientesRes,areasRes, dietasRes, empaquesRes] = await Promise.all([
        api.get(`/pedidos/${id}`),
        api.get("/clientes"),
        api.get("/areas"),
        api.get("/dietas"),
        api.get("/empaques"),
      ]);
      
      setPedido(pedidoRes.data);
      setClientes(clientesRes.data);
      setAreas(areasRes.data);
      setDietasCatalogo(dietasRes.data);
      setEmpaquesCatalogo(empaquesRes.data);
    } catch (err) {
      console.error("Error cargando catálogos:", err);
      setMensaje("⚠️ Error al cargar los datos del pedido.");
      setShowModal(true);
    }
  };

 /* const cargarPedido = async () => {
    try {
      const res = await api.get(`/pedidos/${id}`);
      setPedido(res.data);
    } catch (err) {
      console.error("Error cargando pedido:", err);
    }
  };
*/
  /*const handleChange = (e) => {
    setPedido({ ...pedido, [e.target.name]: e.target.value });
  };*/
  // Cambios en los campos generales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido({ ...pedido, [name]: value });
  };

  /*
  const handleDietaChange = (index, field, value) => {
    const nuevas = [...pedido.dietas];
    nuevas[index][field] = value;
    setPedido({ ...pedido, dietas: nuevas });
  };*/

  // Cambios en dietas
  const handleDietaChange = (index, campo, valor) => {
    const nuevasDietas = [...pedido.dietas];
    nuevasDietas[index][campo] = valor;
    setPedido({ ...pedido, dietas: nuevasDietas });
  };

  /*const handleEmpaqueChange = (index, field, value) => {
    const nuevos = [...pedido.empaques];
    nuevos[index][field] = value;
    setPedido({ ...pedido, empaques: nuevos });
  };*/

  // Cambios en empaques
  const handleEmpaqueChange = (index, campo, valor) => {
    const nuevosEmpaques = [...pedido.empaques];
    nuevosEmpaques[index][campo] = valor;
    setPedido({ ...pedido, empaques: nuevosEmpaques });
  };

  const agregarDieta = () => {
    setPedido({
      ...pedido,
      dietas: [...pedido.dietas, { codigo_dieta: "", cantidad: 1 }],
    });
  };

  const eliminarDieta = (index) => {
    const nuevas = pedido.dietas.filter((_, i) => i !== index);
    setPedido({ ...pedido, dietas: nuevas });
  };

  const agregarEmpaque = () => {
    setPedido({
      ...pedido,
      empaques: [...pedido.empaques, { id_empaque: "", cantidad: 1 }],
    });
  };

  const eliminarEmpaque = (index) => {
    const nuevos = pedido.empaques.filter((_, i) => i !== index);
    setPedido({ ...pedido, empaques: nuevos });
  };

  const actualizarPedido = async () => {
    try {
      
      //await api.put(`/pedidos/${pedido.id_pedido}`, pedido);
      setGuardando(true);
      await api.put(`/pedidos/${id}`, pedido);
      setModalMessage("✅ Pedido actualizado correctamente");
      setShowModal(true);
      setTimeout(() => navigate("/buscar-pedidos"), 1500);
    } catch (err) {
     /* console.error("Error actualizando pedido:", err);
      setModalMessage("❌ Error al actualizar el pedido");
      setShowModal(true);*/
      console.error("Error actualizando pedido:", err);
      const resp = err?.response?.data;
      if (resp?.faltantes) {
        let msg = "❌ No se puede actualizar: faltan precios para:\n";
      if (resp.faltantes.dietas && resp.faltantes.dietas.length) {
        msg += "Dietas:\n" + resp.faltantes.dietas.map(d => ` - ${d.codigo_dieta} (cantidad: ${d.cantidad})`).join("\n") + "\n";
      }
      if (resp.faltantes.empaques && resp.faltantes.empaques.length) {
        msg += "Empaques:\n" + resp.faltantes.empaques.map(e => ` - ${e.id_empaque} (cantidad: ${e.cantidad})`).join("\n");
      }
      setModalMessage(msg);
      } else {
        setModalMessage("❌ Error al actualizar el pedido");
      }
      setShowModal(true);
    }
    finally {
      setGuardando(false);
    }
  };

  if (!pedido) return <p className="text-center mt-10 text-gray-600">Cargando pedido...</p>;

  const soloCancelar = pedido.estado_pedido === "Listo";
  const bloqueado = pedido.estado_pedido === "Cancelado";
  
 

  


  /*
   {
          pedido.dietas.map((d, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <select
              value={d.codigo_dieta}
              onChange={(e) =>
                handleDietaChange(index, "codigo_dieta", e.target.value)
              }
              disabled={soloCancelar || bloqueado}
              className="flex-1 border p-2 rounded-md"
            >
              <option value="">Seleccionar dieta</option>
              {dietasCatalogo.map((diet) => (
                <option key={diet.codigo_dieta} value={diet.codigo_dieta}>
                  {diet.nombre_dieta}
                </option>
              ))}
  */
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Actualizar Pedido #{pedido.id_pedido}
        </h2>

        {/* Datos del pedido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Cliente (solo lectura) */}
          <div>
            <label className="font-semibold">Cliente:</label>
            <input
              value={pedido.cliente_nombre || ""}
              readOnly
              className="w-full border p-2 rounded-md bg-gray-100"
            />
          </div>

          {/* Área */}
          <div>
            <label className="block font-semibold">Área:</label>
            <select
              name="id_area"
              value={pedido.id_area}
              onChange={handleChange}
              disabled={soloCancelar || bloqueado}
              className="border p-2 rounded-md w-full"
            >
              {areas.map((a) => (
                <option key={a.id_area} value={a.id_area}>
                  {a.nombre_area}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo comida */}
          <div>
            <label className="font-semibold">Tipo de comida:</label>
            <select
              name="tipo_comida"
              value={pedido.tipo_comida}
              onChange={handleChange}
              disabled={soloCancelar || bloqueado}
              className="w-full border p-2 rounded-md"
            >
              <option value="Desayuno">Desayuno</option>
              <option value="Almuerzo">Almuerzo</option>
              <option value="Comida">Comida</option>
              <option value="Merienda">Merienda</option>
            </select>
          </div>

          {/* Fechas */}
          <div>
            <label className="font-semibold">Fecha Pedido:</label>
            <input
              type="date"
              name="fecha_pedido"
              value={pedido.fecha_pedido}
              onChange={handleChange}
              disabled={soloCancelar || bloqueado}
              className="w-full border p-2 rounded-md"
            />
          </div>
        </div>

        {/* Dietas */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Dietas</h3>
        {pedido.dietas && pedido.dietas.length > 0 ? (
          pedido.dietas.map((d, index) => (
          <div 
            key={d.codigo_dieta || `dieta-${index}`}
                className="flex gap-2 mb-2 items-center"
           >     
            <select
              value={d.codigo_dieta}
              
              onChange={(e) =>
                handleDietaChange(index, "codigo_dieta", e.target.value)
              }
              disabled={soloCancelar || bloqueado}
              className="flex-1 border p-2 rounded-md"
            >
              <option value="">Seleccionar dieta</option>
              {dietasCatalogo.map((diet) => (
                <option key={diet.codigo_dieta} value={diet.codigo_dieta}>
                  {diet.nombre_dieta}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={d.cantidad}
              min="1"
              disabled={soloCancelar || bloqueado}
              onChange={(e) =>
                handleDietaChange(index, "cantidad", e.target.value)
              }
              className="w-20 border p-2 rounded-md text-center"
            />
            {!bloqueado && (
              <button
                onClick={() => eliminarDieta(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
              >
                ✕
              </button>
            )}
          </div>

        ))
      ):(
        <p className="text-gray-500">No hay dietas asociadas.</p>
      )}
        {!bloqueado && !soloCancelar && (
          <button
            onClick={agregarDieta}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md mt-2"
          >
            ➕ Agregar dieta
          </button>
        )}

        {/* Empaques */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Empaques</h3>
        {pedido.empaques.map((e, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <select
              value={e.id_empaque}
              onChange={(ev) =>
                handleEmpaqueChange(index, "id_empaque", ev.target.value)
              }
              disabled={soloCancelar || bloqueado}
              className="flex-1 border p-2 rounded-md"
            >
              <option value="">Seleccionar empaque</option>
              {empaquesCatalogo.map((em) => (
                <option key={em.id_empaque} value={em.id_empaque}>
                  {em.nombre_empaque}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={e.cantidad}
              min="1"
              disabled={soloCancelar || bloqueado}
              onChange={(ev) =>
                handleEmpaqueChange(index, "cantidad", ev.target.value)
              }
              className="w-20 border p-2 rounded-md text-center"
            />
            {!bloqueado && (
              <button
                onClick={() => eliminarEmpaque(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {!bloqueado && !soloCancelar && (
          <button
            onClick={agregarEmpaque}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md mt-2"
          >
            ➕ Agregar empaque
          </button>
        )}

        {/* Estado */}
        <div className="mt-6">
          <label className="font-semibold">Estado:</label>
          <select
            name="estado_pedido"
            value={pedido.estado_pedido}
            onChange={handleChange}
            disabled={bloqueado}
            className="w-full border p-2 rounded-md"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Listo">Listo</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/buscar-pedidos")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md"
          >
            🔙 Volver
          </button>

          {!bloqueado && (
            <button
              onClick={actualizarPedido}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md"
            >
              💾 Actualizar Pedido
            </button>
          )}
        </div>

        {/* Modal */}
        <Modal
          show={showModal}
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default ActualizarPedido;
