import axios from "axios";

const API = "http://localhost:4000/api/auth/login";

export const login = async (id_usuario, contrasena) => {
  try {
    const { data } = await axios.post(API, { id_usuario, contrasena });

    // Guardar token y usuario en localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    // Configurar token para futuras peticiones
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    return data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error.response?.data || { msg: "Error de conexión" };
  }
};

// 🔓 Registro (opcional)
export const register = async (usuarioData) => {
  try {
    const { data } = await axios.post(`${API}/register`, usuarioData);
    return data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error.response?.data || { error: "Error en registro" };
  }
};

// 🔒 Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  delete axios.defaults.headers.common["Authorization"];
};

export const getUsuarioLogueado = () => {
  return JSON.parse(localStorage.getItem("usuario")) || null;
};

