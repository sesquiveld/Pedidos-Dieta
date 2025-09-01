import api from "../api/axios";

export const getCliente = () => api.get("/clientes").then(r => r.data);
export const createCliente = (data) => api.post("/clientes", data).then(r => r.data);
export const updateCliente = (id, data) => api.put(`/clientes/${id}`, data).then(r => r.data);
export const deleteCliente = (id) => api.delete(`/clientes/${id}`).then(r => r.data);
