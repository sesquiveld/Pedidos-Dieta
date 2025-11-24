import { Link, useLocation } from "react-router-dom"
import "./Navbar.css"

const NavbarInicio = () => {
  const location = useLocation()

  const navItems = [
    { path: "/", label: "Inicio", icon: "🏠" },
    
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

export default NavbarInicio;
