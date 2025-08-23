//export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API_URL = "http://localhost:5000/api";

export const getClientes = async () => {
  const res = await fetch(`${API_URL}/clientes`);
  return res.json();
};

export const createCliente = async (cliente) => {
  const res = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente),
  });
  return res.json();
};
