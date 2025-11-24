import { useEffect, useState } from "react";
import api from "../api/axios";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const Pedidos = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [dietas, setDietas] = useState([]);
  const [empaques, setEmpaques] = useState([]);

  const [pedido, setPedido] = useState({
    id_cliente: "",
    id_area: "",
    dietas: [{ codigo_dieta: "", cantidad: 1 }],
    empaques: [{ id_empaque: "", cantidad: 1 }],
    fecha: new Date().toISOString().split("T")[0], // fecha creación (read-only)
    fecha_pedido: new Date().toISOString().split("T")[0], // fecha editable
    tipo_comida: "",
    observaciones: "",
    estado_pedido: "Pendiente",
  });

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [clientesRes, areasRes, dietasRes, empaquesRes] = await Promise.all([
        api.get("/clientes"),
        api.get("/areas"),
        api.get("/dietas"),
        api.get("/empaques"),
      ]);
      setClientes(clientesRes.data);
      setAreas(areasRes.data);
      setDietas(dietasRes.data);
      setEmpaques(empaquesRes.data);
    } catch (error) {
      console.error("Error cargando catálogos:", error);
    }
  };

  const handleChange = (e) => {
    setPedido({ ...pedido, [e.target.name]: e.target.value });
  };

  // 🚫 Validar duplicados en dietas
  const handleDietaChange = (i, value) => {
    if (pedido.dietas.some((d, idx) => d.codigo_dieta === value && idx !== i)) {
      setModalMessage("⚠️ La dieta ya está incluida en el pedido");
      setShowModal(true);
      return;
    }
    const newDietas = [...pedido.dietas];
    newDietas[i].codigo_dieta = value;
    setPedido({ ...pedido, dietas: newDietas });
  };

  // 🚫 Validar duplicados en empaques
  const handleEmpaqueChange = (i, value) => {
    if (pedido.empaques.some((e, idx) => e.id_empaque === value && idx !== i)) {
      setModalMessage("⚠️ El empaque ya está incluido en el pedido");
      setShowModal(true);
      return;
    }
    const newEmpaques = [...pedido.empaques];
    newEmpaques[i].id_empaque = value;
    setPedido({ ...pedido, empaques: newEmpaques });
  };

  const guardarPedido = async () => {
    try {

      if (!pedido.id_cliente) {
        setModalMessage("❌ Debe seleccionar un cliente");
        setShowModal(true);
        return;
      }
      if (!pedido.id_area) {
        setModalMessage("❌ Debe seleccionar un área");
        setShowModal(true);
        return;
      }
      if (!pedido.tipo_comida) {
        setModalMessage("❌ Debe seleccionar un tipo de comida");
        setShowModal(true);
        return;
      }

      // ✅ Validar fecha
      const hoy = new Date().toISOString().split("T")[0];
      if (pedido.fecha_pedido < hoy) {
        setModalMessage("❌ La fecha del pedido no puede ser anterior a hoy");
        setShowModal(true);
        return;
      }

      let res;
      if (pedido.id_pedido && pedido.estado_pedido === "Pendiente") {
        res = await api.put(`/pedidos/${pedido.id_pedido}`, pedido); 
        //No. ${pedido.id_pedido}
        setModalMessage(`✅ El pedido  fue actualizado exitosamente`);
      } else if (!pedido.id_pedido) {
        res = await api.post("/pedidos", pedido);
        setModalMessage(`✅ El pedido fue creado exitosamente`);
      } else {
        setModalMessage("❌ Solo se pueden editar pedidos en estado Pendiente");
      }

      setShowModal(true);
      cancelar();
    } catch (error) {
      /*console.error("Error guardando pedido:", error);
      setModalMessage("❌ Error al guardar el pedido");
      setShowModal(true);*/
      console.error("Error guardando pedido:", error);
     // Si backend devuelve listas de faltantes, mostrarlas en modal
     const resp = error?.response?.data;
     if (resp?.faltantes) {
      let msg = "❌ No se puede guardar: faltan precios para:\n";
     if (resp.faltantes.dietas && resp.faltantes.dietas.length) {
      msg += "Dietas:\n" + resp.faltantes.dietas.map(d => ` - ${d.codigo_dieta} (cantidad: ${d.cantidad})`).join("\n") + "\n";
     }
     if (resp.faltantes.empaques && resp.faltantes.empaques.length) {
       msg += "Empaques:\n" + resp.faltantes.empaques.map(e => ` - ${e.id_empaque} (cantidad: ${e.cantidad})`).join("\n");
     }
     setModalMessage(msg);
     } else {
       setModalMessage("❌ Error al guardar el pedido");
     }
    setShowModal(true);
    }
  };

  const cancelar = () => {
    setPedido({
      id_cliente: "",
      id_area: "",
      dietas: [{ codigo_dieta: "", cantidad: 1 }],
      empaques: [{ id_empaque: "", cantidad: 1 }],
      fecha: new Date().toISOString().split("T")[0],
      fecha_pedido: new Date().toISOString().split("T")[0],
      tipo_comida: "",
      observaciones: "",
      estado_pedido: "Pendiente",
    });
  };

const navigateHome = () => {
  const user = JSON.parse(localStorage.getItem("usuario")); // o usa tu contexto si lo tienes
  if (user?.tipo_usuario === "Administrador") {
    navigate("/home-admin");
  } else {
    navigate("/home-user");
  }
};

//className="p-2 border rounded-lg" ; className="bg-red-500 text-white px-2 rounded-lg hover:bg-red-600"

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Gestión de Pedidos
        </h2>

        {/* Formulario */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cliente */}
          <div>
            <label className="block font-semibold mb-1">Cliente</label>
            <select
              name="id_cliente"
              value={pedido.id_cliente}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            >
              <option value="">Seleccione cliente</option>
              {clientes.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Área */}
          <div>
            <label className="block font-semibold mb-1">Área</label>
            <select
              name="id_area"
              value={pedido.id_area}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            >
              <option value="">Seleccione área</option>
              {areas.map((a) => (
                <option key={a.id_area} value={a.id_area}>
                  {a.nombre_area}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de comida */}
          <div>
            <label className="block font-semibold mb-1">Tipo de comida</label>
            <select
              name="tipo_comida"
              value={pedido.tipo_comida}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            >
              <option value="">Seleccione tipo</option>
              <option value="Desayuno">Desayuno</option>
              <option value="Almuerzo">Almuerzo</option>
              <option value="Comida">Comida</option>
              <option value="Merienda">Merienda</option>
            </select>
          </div>

          {/* Fecha creación */}
          <div>
            <label className="block font-semibold mb-1">Fecha creación</label>
            <input
              type="date"
              name="fecha"
              value={pedido.fecha}
              readOnly
              className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Fecha del pedido */}
          <div>
            <label className="block font-semibold mb-1">Fecha del pedido</label>
            <input
              type="date"
              name="fecha_pedido"
              value={pedido.fecha_pedido}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            />
          </div>
        </form>

        {/* Dietas */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-3 text-green-700">Dietas</h3>
          {pedido.dietas.map((d, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <select
                value={d.codigo_dieta}
                onChange={(e) => handleDietaChange(i, e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="">Seleccione dieta</option>
                {dietas.map((di) => (
                  <option key={di.codigo_dieta} value={di.codigo_dieta}>
                    {di.nombre_dieta}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={d.cantidad}
                onChange={(e) => {
                  const newDietas = [...pedido.dietas];
                  newDietas[i].cantidad = Number(e.target.value);
                  setPedido({ ...pedido, dietas: newDietas });
                }}
                className="border rounded-md p-2 w-1/4 text-center focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={() =>
                  setPedido({
                    ...pedido,
                    dietas: pedido.dietas.filter((_, idx) => idx !== i),
                  })
                }
                className="bg-green-200 text-black px-3 py-1 rounded-lg hover:bg-blue-300"
              >
                ✖ Eliminar Dieta
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setPedido({
                ...pedido,
                dietas: [...pedido.dietas, { codigo_dieta: "", cantidad: 1 }],
              })
            }
            className="mt-2 bg-green-700 text-white px-3 py-1 rounded-lg hover:bg-green-800"
          >
            ➕ Agregar dieta
          </button>
        </div>

        {/* Empaques */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-3 text-green-700">Empaques</h3>
          {pedido.empaques.map((em, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <select
                value={em.id_empaque}
                onChange={(e) => handleEmpaqueChange(i, e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="">Seleccione empaque</option>
                {empaques.map((ep) => (
                  <option key={ep.id_empaque} value={ep.id_empaque}>
                    {ep.nombre_empaque}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                
                value={em.cantidad}
                onChange={(e) => {
                  const newEmpaques = [...pedido.empaques];
                  newEmpaques[i].cantidad = Number(e.target.value);
                  setPedido({ ...pedido, empaques: newEmpaques });
                }}
                
                className="border rounded-md p-2 w-1/4 text-center focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={() =>
                  setPedido({
                    ...pedido,
                    empaques: pedido.empaques.filter((_, idx) => idx !== i),
                  })
                }
                className="bg-green-200 hover:bg-blue-300 text-black px-6 py-2 rounded-md shadow-md transition" 
              >
                ✖ Eliminar Empaque
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setPedido({
                ...pedido,
                empaques: [...pedido.empaques, { id_empaque: "", cantidad: 1 }],
              })
            }
            className="mt-3 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
          >
            ➕ Agregar empaque
          </button>
        </div>

        {/* Observaciones */}
        <div className="mt-8">
          <label className="block font-semibold mb-1">Observaciones</label>
          <textarea
            name="observaciones"
            value={pedido.observaciones}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Estado */}
        <div className="mt-6">
          <label className="block font-semibold mb-1">Estado</label>
          <select
            name="estado_pedido"
            value={pedido.estado_pedido}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Listo">Listo</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap justify-between mt-10 gap-3">
          <button
            type="button"
            onClick={guardarPedido}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg shadow-lg"
          >
            {pedido.id_pedido ? "Actualizar" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={cancelar}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Limpiar Campos
          </button>
          <button
            type="button"
            onClick={() => navigate("/buscar-pedidos")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Buscar pedidos
          </button>

           <button
            type="button"
            onClick={navigateHome}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            🔙 Volver al inicio
          </button>
        </div>
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

export default Pedidos;
