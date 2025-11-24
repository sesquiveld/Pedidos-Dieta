

import api from "../api/axios.js";

export const getAreas = () => api.get("/areas").then(r => r.data);
export const getDietas = () => api.get("/dietas").then(r => r.data);
export const getEmpaques = () => api.get("/empaques").then(r => r.data);
export const getUsuario = () => api.get("/usuarios").then(r => r.data);
export const getPedido =() => api.get("/pedido").then(r => r.data);

export const createArea = (data) => api.post("/areas", data).then(r => r.data);
export const createDieta = (data) => api.post("/dietas", data).then(r => r.data);
export const createEmpaque = (data) => api.post("/empaques", data).then(r => r.data);
export const createPedido = (data) => api.post("/pedido", data).then(r => r.data);
export const createUsuario = (data) => api.post("/usuarios", data).then(r => r.data);
