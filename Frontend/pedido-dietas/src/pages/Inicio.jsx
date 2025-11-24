import { Link } from "react-router-dom";
import fondo from "../assets/Login.png";

const Inicio = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      {/* Encabezado */}
      <header className="flex justify-between items-center bg-green-700 text-white px-6 py-4 shadow-lg">
        <h1 className="text-2xl font-bold ">Gestión de alimentación para hospitales y clínicas</h1>
        <Link
          to="/login"
          className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition font-bold"
        >
          Login
        </Link>
      </header>

      {/* Texto central */}
      <div className="flex flex-1 items-center justify-center">
        <h2 className="text-4xl md:text-5xl font-bold text-green-700 drop-shadow-lg text-left">
                    Bienvenido al Sistema de Pedidos
        </h2>
      </div>
    </div>
  );
};

export default Inicio;

