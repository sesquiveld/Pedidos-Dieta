import api from "./api.js";

// Obtener usuarios
export const getUsuarios = async () => {
  try {
    const { data } = await api.get("/usuarios");
    return data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
};

// Crear usuario
export const createUsuario = async (usuario) => {
  try {
    const { data } = await api.post("/usuarios", usuario);
    return data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

// Actualizar usuario
export const updateUsuario = async (id_usuario, usuario) => {
  try {
    const { data } = await api.put(`/usuarios/${id_usuario}`, usuario);
    return data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// Eliminar usuario
export const deleteUsuario = async (id_usuario) => {
  try {
    await api.delete(`/usuarios/${id_usuario}`);
    return true;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return false;
  }
};


