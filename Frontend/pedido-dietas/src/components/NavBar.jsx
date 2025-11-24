import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioLogueado } from "../services/authService";
import LogoutButton from "../components/LogoutButton";


const NavBar = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getUsuarioLogueado();
    setUsuario(u);
  }, []);

  
  return (
    <header className="flex justify-between items-center bg-green-700 text-white px-6 py-4 shadow-lg">
      <h1 className="text-xl font-bold">Alimentos Cartago</h1>

      {usuario ? (
        <nav className="space-x-4 flex items-center">
          {/* Si es Administrador */}
          {usuario.tipo_usuario === "Administrador" && (
            <>
              <button onClick={() => navigate("/clientes")} className="hover:underline">
                Clientes
              </button>
              <button onClick={() => navigate("/areas")} className="hover:underline">
                Áreas
              </button>
              <button onClick={() => navigate("/dietas")} className="hover:underline">
                Dietas
              </button>
              <button onClick={() => navigate("/cliente-dietas")} className="hover:underline">
                Cliente-Dietas
              </button>
              <button onClick={() => navigate("/empaques")} className="hover:underline">
                Empaques
              </button>
              <button onClick={() => navigate("/pedidos")} className="hover:underline">
                Pedidos
              </button>
              <button onClick={() => navigate("/usuarios")} className="hover:underline">
                Usuarios
              </button>
              <button onClick={() => navigate("/reportes")} className="hover:underline">
                Reportes
              </button>
              <LogoutButton />
            </>
          )}

          {/* Si es Usuario */}
          {usuario.tipo_usuario === "Usuario" && (
            <button onClick={() => navigate("/pedidos")} className="hover:underline">
              Mis Pedidos
            </button>
          )}

          {/* Botón salir */}
          
        </nav>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition"
        >
          Login
        </button>
      )}
    </header>
  );
};

export default NavBar;


