import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Pedido from "./pages/pedidos.jsx";
import Areas from "./pages/Areas";

import Navbar from "./components/NavBar"
import Home from "./pages/Home"
import Clientes from "./pages/Clientes.jsx"
import Empaques from "./pages/Empaques"
import Usuario from "./pages/Usuarios.jsx"

import "./App.css"
// importa también Clientes, Dietas, Empaques si ya los creaste

export default function App() {
   return (
    <BrowserRouter>
      <div className="App">   
          <Navbar />
          <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/empaques" element={<Empaques />} />
            <Route path="/usuarios" element={<Usuario />} />
            <Route path="/pedidos" element={<Pedido />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}


  /*
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
        <Link to="/">Inicio</Link>
        <Link to="/pedidos">Pedidos</Link>
        <Link to="/areas">Áreas</Link>
        {/* <Link to="/clientes">Clientes</Link> *///}
  //      {/* <Link to="/dietas">Dietas</Link> */}
  //      {/* <Link to="/empaques">Empaques</Link> */}
/*      </nav>
      <Routes>
        <Route path="/" element={<div style={{padding:24}}><h1>Sistema de Pedidos Hospitalarios</h1></div>} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/areas" element={<Areas />} />
      </Routes>
    </BrowserRouter>
  );
}
*/







/*"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/NavBar"
import Home from "./pages/Home"
import Clientes from "./pages/Clientes"
import Areas from "./pages/Areas"
import Empaques from "./pages/Empaques"
import Usuario from "./pages/Usuarios.jsx"
import Pedidos from "./pages/Pedidos"
import "./App.css"

//<Navbar />
//            <Route path="/usuarios" element={<Usuario />} />
//            <Route path="/pedidos" element={<Pedidos />} />


function App() {
  return (
    <Router>
      <div className="App">
        
          <Navbar />
          <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/empaques" element={<Empaques />} />
            <Route path="/usuarios" element={<Usuario />} />
            <Route path="/pedidos" element={<Pedidos />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;


/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/