import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [id_usuario, setIdUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(id_usuario, contrasena);
      
      console.log(id_usuario, contrasena);

      setMensaje(`Bienvenido ${data.usuario.nombre_usuario}`);
      setMostrarModal(true);

      setTimeout(() => {
        setMostrarModal(false);
        if (data.usuario.tipo_usuario === "Administrador") {
          navigate("/home-admin");
        } else {
          navigate("/home-user");
        }
      }, 2000);
    } catch (error) {
      setMensaje(error.msg || "Credenciales inválidas");
      setMostrarModal(true);
      setTimeout(() => setMostrarModal(false), 2000);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-green-700">
          Iniciar Sesión
        </h2>

        <input
          type="text"
          placeholder="ID Usuario"
          value={id_usuario}
          onChange={(e) => setIdUsuario(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
        />

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition w-full mr-2"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition w-full ml-2"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-lg font-semibold text-green-700">{mensaje}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;




