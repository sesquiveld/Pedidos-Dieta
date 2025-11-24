import axios from "axios";

const API = "http://localhost:4000/api/pedidos";

// Obtener todos los pedidos
export async function getPedidos() {
  const res = await axios.get(API);
  return res.data;
}

// Crear pedido
export async function createPedido(data) {
  const res = await axios.post(API, data);
  return res.data;
}

// Actualizar pedido
export async function updatePedido(id, data) {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
}

// Eliminar pedido
export async function deletePedido(id) {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
}
