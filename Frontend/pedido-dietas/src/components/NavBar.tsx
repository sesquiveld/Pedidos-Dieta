//"use client"

import { Link, useLocation } from "react-router-dom"
import "./Navbar.css"

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: "/", label: "Inicio", icon: "🏠" },
    { path: "/clientes", label: "Clientes", icon: "👥" },
    { path: "/areas", label: "Áreas", icon: "🏢" },
    { path: "/empaques", label: "Empaques", icon: "📦" },
    { path: "/usuarios", label: "Usuarios", icon: "👤" },
    { path: "/pedidos", label: "Pedidos", icon: "📋" },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🏥 Pedidos Dieta</h2>
      </div>
      <ul className="navbar-nav">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link to={item.path} className={`nav-link ${location.pathname === item.path ? "active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
