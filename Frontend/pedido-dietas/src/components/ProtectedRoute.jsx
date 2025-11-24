
// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { getUsuarioLogueado } from "../services/authService";

const ProtectedRoute = ({ children, roles }) => {
  const usuario = getUsuarioLogueado();
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Si no hay token o usuario, enviar a login
  if (!usuario || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Validar roles si se pasaron
  if (roles && !roles.includes(usuario.tipo_usuario)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

