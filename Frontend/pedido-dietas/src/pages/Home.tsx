import { useState, useEffect } from "react";
import api from "../api/axios"; 
import "./Home.css";

const Home = () => {
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [stats, setStats] = useState({
    clientes: 0,
    areas: 0,
    empaques: 0,
    usuarios: 0,
    pedidos: 0,
    dietas: 0,
  });

  useEffect(() => {
    checkDatabaseConnection();
    loadStats();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const response = await api.get("/health");
      if (response.data.status === "ok") {
        setConnectionStatus("connected");
      } else {
        setConnectionStatus("error");
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      setConnectionStatus("error");
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await api.get("/stats");
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "#4CAF50";
      case "error":
        return "#f44336";
      default:
        return "#ff9800";
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Conectado";
      case "error":
        return "Error de conexión";
      default:
        return "Verificando...";
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Sistema de Pedidos de Dieta</h1>
        <p>Gestión de alimentación para hospitales y clínicas</p>
      </header>

      <div className="connection-status">
        <div className="status-indicator">
          <div
            className="status-dot"
            style={{ backgroundColor: getConnectionStatusColor() }}
          ></div>
          <span>Base de datos: {getConnectionStatusText()}</span>
        </div>
        {connectionStatus === "error" && (
          <button onClick={checkDatabaseConnection} className="retry-btn">
            Reintentar conexión
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.clientes}</h3>
            <p>Clientes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>{stats.areas}</h3>
            <p>Áreas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.empaques}</h3>
            <p>Empaques</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-info">
            <h3>{stats.dietas}</h3>
            <p>Dietas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <h3>{stats.usuarios}</h3>
            <p>Usuarios</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.pedidos}</h3>
            <p>Pedidos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


