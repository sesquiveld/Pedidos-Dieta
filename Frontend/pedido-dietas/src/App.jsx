import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import HomeAdmin from "./pages/HomeAdmin";
import HomeUser from "./pages/HomeUser";
import Clientes from "./pages/Clientes";
import Areas from "./pages/Areas";
import Usuarios from "./pages/Usuarios";
import Pedidos from "./pages/pedidos";
import Dietas from "./pages/Dietas";
import Empaques from "./pages/Empaques";
import ClienteDietas from "./pages/ClienteDietas";
import ProtectedRoute from "./components/ProtectedRoute";
import Reportes from "./pages/Reportes";
import BuscarPedidos from "./pages/BuscarPedido";
import ActualizarPedido from "./pages/ActualizarPedido";


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/home-admin"
          element={
            <ProtectedRoute roles={["Administrador"]}>
              <HomeAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home-user"
          element={
            <ProtectedRoute roles={["Usuario", "Nutricionista", "Cocina", "Enfermeria"]}>
              <HomeUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute roles={["Administrador"]}>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/areas"
          element={
            <ProtectedRoute roles={["Administrador"]}>
              <Areas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute roles={["Administrador"]}>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute roles={["Administrador", "Usuario"]}>
              <Pedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dietas"
          element={
            <ProtectedRoute roles={["Administrador"]}>
              <Dietas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empaques"
          element={
            <ProtectedRoute roles={["Administrador"]}>
              <Empaques />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente-dietas"
          element={
            <ProtectedRoute roles={["Administrador"]}>
              <ClienteDietas />
            </ProtectedRoute>
          }
        />
        <Route
        path="/reportes"
          element={
            <ProtectedRoute roles={["Administrador"]}>
              <Reportes />
            </ProtectedRoute>
          }
        />
        
         <Route
        path="/buscar-pedidos"
          element={
            <ProtectedRoute roles={["Administrador", "Usuario"]}>
              <BuscarPedidos />
            </ProtectedRoute>
          }
        />
        <Route
        path="/actualizar-pedido/:id"
          element={
            <ProtectedRoute roles={["Administrador", "Usuario"]}>
              <ActualizarPedido />
            </ProtectedRoute>
          }
        />


      </Routes>
      
    </Router>
  );
}

export default App;

