import { useEffect, useState } from "react";
import api from "../api/axios";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const BuscarPedidos = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [dietas, setDietas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  const [filtros, setFiltros] = useState({
    id_pedido: "",
    id_cliente: "",
    id_area: "",
    id_dieta: "",
    id_usuario: "",
    estado_pedido: "",
  });

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [clientesRes, areasRes, dietasRes, usuariosRes] = await Promise.all([
        api.get("/clientes"),
        api.get("/areas"),
        api.get("/dietas"),
         api.get("/usuarios"),
      ]);
      setClientes(clientesRes.data);
      setAreas(areasRes.data);
      setDietas(dietasRes.data);
      setUsuarios(usuariosRes.data);
    } catch (error) {
      console.error("Error cargando catálogos:", error);
    }
  };

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const buscarPedidos = async () => {
    try {
      setCargando(true);

      // Si solo hay id_pedido, usa la ruta directa /pedidos/:id
      if (filtros.id_pedido && !Object.values(filtros).some((v, k) => k !== "id_pedido" && v)) {
        const res = await api.get(`/pedidos/${filtros.id_pedido}`);
        setPedidos(res.data ? [res.data] : []);
      } else {
        const filtrosActivos = Object.fromEntries(
          Object.entries(filtros).filter(([_, v]) => v)
        );
        const res = await api.get("/pedidos", { params: filtrosActivos });
        setPedidos(res.data);
      }
    } catch (error) {
      console.error("Error buscando pedidos:", error);
      setModalMessage("⚠️ No se pudo obtener la información del pedido.");
      setShowModal(true);
    } finally {
      setCargando(false);
    }
  };

  const editarPedido = (pedido) => {
    if (pedido.estado_pedido === "Cancelado") {
      setModalMessage("❌ Los pedidos cancelados no se pueden editar.");
      setShowModal(true);
      return;
    }
    navigate(`/actualizar-pedido/${pedido.id_pedido}`);
  };

  const navigateHome = () => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user?.tipo_usuario === "Administrador") navigate("/home-admin");
    else navigate("/home-user");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Buscar Pedidos
        </h2>

        {/* Botones principales */}
        <div className="flex justify-between mb-6">
          <button
            type="button"
            onClick={navigateHome}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ⬅ Volver al inicio
          </button>

          <button
            onClick={buscarPedidos}
            disabled={cargando}
            className={`${
              cargando ? "bg-gray-400" : "bg-green-700 hover:bg-green-800"
            } text-white px-4 py-2 rounded-lg`}
          >
            {cargando ? "Buscando..." : "🔍 Buscar"}
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-1">ID Pedido</label>
            <input
              name="id_pedido"
              placeholder="Número pedido"
              value={filtros.id_pedido}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Cliente</label>
            <select
              name="id_cliente"
              value={filtros.id_cliente}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Todos</option>
              {clientes.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Área</label>
            <select
              name="id_area"
              value={filtros.id_area}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Todas</option>
              {areas.map((a) => (
                <option key={a.id_area} value={a.id_area}>
                  {a.nombre_area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Dieta</label>
            <select
              name="id_dieta"
              value={filtros.id_dieta}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Todas</option>
              {dietas.map((d) => (
                <option key={d.codigo_dieta} value={d.codigo_dieta}>
                  {d.nombre_dieta}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Usuario</label>
            <select
              name="id_usuario"
              value={filtros.id_usuario}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            >
               <option value="">Todos</option>
               {usuarios.map((u) => (
               <option key={u.id_usuario} value={u.id_usuario}>
                  {u.nombre_usuario}
                </option>
             ))}
            </select>
          </div>      
          <div>
            <label className="block font-semibold mb-1">Estado</label>
            <select
              name="estado_pedido"
              value={filtros.estado_pedido}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Listo">Listo</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="p-2">ID Pedido</th>
                <th className="p-2">Cliente</th>
                <th className="p-2">Área</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Fecha Pedido</th>
                <th className="p-2">Usuario</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length > 0 ? (
                pedidos.map((p) => (
                  <tr key={p.id_pedido} className="border-b hover:bg-gray-100">
                    <td className="p-2 text-center">{p.id_pedido}</td>
                    <td className="p-2">{p.Cliente?.nombre || "—"}</td>
                    <td className="p-2">{p.Area?.nombre_area || "—"}</td>
                    <td className="p-2 text-center">{p.fecha}</td>
                    <td className="p-2 text-center">{p.fecha_pedido}</td>
                    <td className="p-2 text-center">{p.Usuario?.nombre_usuario || "—"}</td>
                    <td className="p-2 text-center">{p.estado_pedido}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => editarPedido(p)}
                        disabled={p.estado_pedido === "Cancelado"}
                        className={`px-3 py-1 rounded text-white ${
                          p.estado_pedido === "Pendiente"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : p.estado_pedido === "Listo"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        ✏️ Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No se encontraron pedidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          show={showModal}
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default BuscarPedidos;
