const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const getToken = () => localStorage.getItem("token") || "";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const api = {
  // Auth
  register: (data: { nombre: string; email: string; password: string; balanceInicial: number }) =>
    fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  login: (data: { email: string; password: string }) =>
    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  forgotPassword: (email: string) =>
    fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then((res) => res.json()),

  resetPassword: (codigo: string, nuevaPassword: string) =>
    fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo, nuevaPassword }),
    }).then((res) => res.json()),

  // Transacciones
  registerTransaction: (data: {
    monto: number;
    descripcion: string;
    tipo: "INGRESO" | "GASTO";
  }) =>
    fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  getTransactions: () =>
    fetch(`${API_URL}/transactions`, {
      headers: authHeaders(),
    }).then((res) => res.json()),

  getBalance: () =>
    fetch(`${API_URL}/transactions/balance`, {
      headers: authHeaders(),
    }).then((res) => res.json()),
};
