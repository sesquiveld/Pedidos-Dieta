
/*
// src/services/catalogosService.js
import axios from "axios";

// Configura la URL base del backend
const API_URL = "http://localhost:3000/api"; 

// ==================== AREAS ====================
export const listarAreas = async () => {
  const response = await axios.get(`${API_URL}/areas`);
  return response.data;
};

export const crearArea = async (nuevaArea) => {
  const response = await axios.post(`${API_URL}/areas`, nuevaArea);
  return response.data;
};

// ==================== DIETAS ====================
export const listarDietas = async () => {
  const response = await axios.get(`${API_URL}/dietas`);
  return response.data;
};

export const crearDieta = async (nuevaDieta) => {
  const response = await axios.post(`${API_URL}/dietas`, nuevaDieta);
  return response.data;
};

// ==================== CLIENTES ====================
export const listarClientes = async () => {
  const response = await axios.get(`${API_URL}/clientes`);
  return response.data;
};

export const crearCliente = async (nuevoCliente) => {
  const response = await axios.post(`${API_URL}/clientes`, nuevoCliente);
  return response.data;
};

// ==================== EMPAQUES ====================
export const listarEmpaques = async () => {
  const response = await axios.get(`${API_URL}/empaques`);
  return response.data;
};

export const crearEmpaque = async (nuevoEmpaque) => {
  const response = await axios.post(`${API_URL}/empaques`, nuevoEmpaque);
  return response.data;
};

// ==================== PEDIDOS ====================
export const listarPedidos = async () => {
  const response = await axios.get(`${API_URL}/pedidos`);
  return response.data;
};

export const crearPedido = async (nuevoPedido) => {
  const response = await axios.post(`${API_URL}/pedidos`, nuevoPedido);
  return response.data;
};
*/


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
