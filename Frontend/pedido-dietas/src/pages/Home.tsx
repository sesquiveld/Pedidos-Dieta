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




/*import { useState, useEffect } from "react"
import api from "../api/axios" // importamos la instancia de axios
import "./Home.css"

const Home = () => {
  const [connectionStatus, setConnectionStatus] = useState("checking")
  const [stats, setStats] = useState({
    clientes: 0,
    areas: 0,
    empaques: 0,
    usuarios: 0,
    pedidos: 0,
  })

  useEffect(() => {
    checkDatabaseConnection()
    loadStats()
  }, [])

  // 🔹 Verificar conexión al backend
  const checkDatabaseConnection = async () => {
    try {
      const response = await api.get("/health")
      if (response.status === 200) {
        setConnectionStatus("connected")
      } else {
        setConnectionStatus("error")
      }
    } catch (error) {
      console.error("Error checking connection:", error)
      setConnectionStatus("error")
    }
  }

  // 🔹 Cargar estadísticas de cada tabla
  const loadStats = async () => {
    try {
      const endpoints = ["clientes", "areas", "empaques", "usuarios", "pedidos"]

      const promises = endpoints.map(async (endpoint) => {
        try {
          const res = await api.get(`/${endpoint}`)
          return { [endpoint]: res.data.length || 0 }
        } catch (err) {
          console.error(`Error loading ${endpoint}:`, err.message)
          return { [endpoint]: 0 }
        }
      })

      const results = await Promise.all(promises)
      const newStats = results.reduce((acc, curr) => ({ ...acc, ...curr }), {})
      setStats(newStats)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  // 🔹 Colores del estado de conexión
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "#4CAF50"
      case "error":
        return "#f44336"
      default:
        return "#ff9800"
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Conectado"
      case "error":
        return "Error de conexión"
      default:
        return "Verificando..."
    }
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Sistema de Pedidos de Dieta</h1>
        <p>Gestión de alimentación para hospitales y clínicas</p>
      </header>

      <div className="connection-status">
        <div className="status-indicator">
          <div className="status-dot" style={{ backgroundColor: getConnectionStatusColor() }}></div>
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

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => (window.location.href = "/clientes")}>
            <span>👥</span>
            Gestionar Clientes
          </button>
          <button className="action-btn" onClick={() => (window.location.href = "/pedidos")}>
            <span>📋</span>
            Nuevo Pedido
          </button>
          <button className="action-btn" onClick={() => (window.location.href = "/areas")}>
            <span>🏢</span>
            Configurar Áreas
          </button>
          <button className="action-btn" onClick={() => (window.location.href = "/usuarios")}>
            <span>👤</span>
            Gestionar Usuarios
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home

*/


/*
//"use client"

import { useState, useEffect } from "react"
import "./Home.css"

const Home = () => {
  const [connectionStatus, setConnectionStatus] = useState("checking")
  const [stats, setStats] = useState({
    clientes: 0,
    areas: 0,
    empaques: 0,
    usuarios: 0,
    pedidos: 0,
  })

  useEffect(() => {
    checkDatabaseConnection()
    loadStats()
  }, [])

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/health")
      if (response.ok) {
        setConnectionStatus("connected")
      } else {
        setConnectionStatus("error")
      }
    } catch (error) {
      console.error("Error checking connection:", error)
      setConnectionStatus("error")
    }
  }

  const loadStats = async () => {
    try {
      const endpoints = ["clientes", "areas", "empaques", "usuarios", "pedidos"]
      const promises = endpoints.map((endpoint) =>
        fetch(`http://localhost:4000/api/${endpoint}`)
          .then((res) => res.json())
          .then((data) => ({ [endpoint]: data.length || 0 }))
          .catch(() => ({ [endpoint]: 0 })),
      )

      const results = await Promise.all(promises)
      const newStats = results.reduce((acc, curr) => ({ ...acc, ...curr }), {})
      //setStats(newStats)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "#4CAF50"
      case "error":
        return "#f44336"
      default:
        return "#ff9800"
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Conectado"
      case "error":
        return "Error de conexión"
      default:
        return "Verificando..."
    }
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Sistema de Pedidos de Dieta</h1>
        <p>Gestión de alimentación para hospitales y clínicas</p>
      </header>

      <div className="connection-status">
        <div className="status-indicator">
          <div className="status-dot" style={{ backgroundColor: getConnectionStatusColor() }}></div>
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

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => (window.location.href = "/clientes")}>
            <span>👥</span>
            Gestionar Clientes
          </button>
          <button className="action-btn" onClick={() => (window.location.href = "/pedidos")}>
            <span>📋</span>
            Nuevo Pedido
          </button>
          <button className="action-btn" onClick={() => (window.location.href = "/areas")}>
            <span>🏢</span>
            Configurar Áreas
          </button>
          <button className="action-btn" onClick={() => (window.location.href = "/usuarios")}>
            <span>👤</span>
            Gestionar Usuarios
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
*/