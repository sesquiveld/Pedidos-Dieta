import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    //config.headers["x-auth-token"] = token;
     config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
