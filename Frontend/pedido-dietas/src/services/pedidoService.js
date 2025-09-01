import api from "../api/axios";

export const getPedidos = () => api.get("/pedidos").then(r => r.data);
export const createPedido = (data) => api.post("/pedidos", data).then(r => r.data);
export const updatePedido = (id, data) => api.put(`/pedidos/${id}`, data).then(r => r.data);
export const deletePedido = (id) => api.delete(`/pedidos/${id}`).then(r => r.data);
