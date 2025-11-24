import { useState } from "react";
import axios from "axios";

const CambiarContrasena = ({ id_usuario }) => {
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nueva !== confirmar) {
      alert("Las contraseñas no coinciden ❌");
      return;
    }
    try {
      await axios.put(`http://localhost:4000/api/usuarios/${id_usuario}/contrasena`, {
        contrasena: nueva,
      });
      alert("Contraseña actualizada ✅");
    } catch (error) {
      console.error(error);
      alert("Error cambiando la contraseña ❌");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CambiarContrasena;
