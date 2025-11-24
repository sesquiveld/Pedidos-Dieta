

import { useNavigate } from "react-router-dom";
import { logout, getUsuarioLogueado } from "../services/authService.js";
import NavBar from "../components/NavBar";
const HomeUser = () => {
  const navigate = useNavigate();
  const usuario = getUsuarioLogueado();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: 24 }}>
      <NavBar />  
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>👤 Panel Usuario</h2>
        <div>
          <span>Bienvenido, {usuario?.nombre_usuario}</span>
          <button onClick={handleLogout} style={{ marginLeft: 12 }}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <hr />

      <div style={{ display: "grid", gap: 12, maxWidth: 600 }}>
        <button onClick={() => navigate("/mis-pedidos")}>
          📦 Mis Pedidos
        </button>
        <button onClick={() => navigate("/nuevo-pedido")}>
          ➕ Nuevo Pedido
        </button>
        <button onClick={() => navigate("/reportes-usuario")}>
          📊 Reportes (sin precios)
        </button>
      </div>
    </div>
  );
}
  export default HomeUser;
