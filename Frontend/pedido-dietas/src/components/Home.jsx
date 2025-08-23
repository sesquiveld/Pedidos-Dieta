import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>🏥 Sistema de Pedidos Hospitalarios</h1>
      <nav>
        <Link to="/clientes">Clientes</Link> | 
        <Link to="/areas">Áreas</Link> | 
        <Link to="/dietas">Dietas</Link> | 
        <Link to="/empaques">Empaques</Link> | 
        <Link to="/pedidos">Pedidos</Link> | 
        <Link to="/reportes">Reportes</Link>
      </nav>
    </div>
  );
}

export default Home;
