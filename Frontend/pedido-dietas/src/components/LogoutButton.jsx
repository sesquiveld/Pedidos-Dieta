// src/components/LogoutButton.jsx
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-green-100 text-black px-4 py-2 rounded-lg hover:bg-green-200 transition"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
