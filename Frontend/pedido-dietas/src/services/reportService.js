import api from "./api.js";

// Reporte por usuario
export const reportPorUsuario = async (desde, hasta) => {
  try {
    const { data } = await api.get("/pedidos/reportes/usuarios", {
      params: { desde, hasta },
    });
    return data;
  } catch (error) {
    console.error("Error al obtener reporte por usuario:", error);
    return [];
  }
};
