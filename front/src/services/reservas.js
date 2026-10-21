
const API_URL = "http://localhost:8080/api/reservas";

async function request(url, options = {}) {
  const token = localStorage.getItem("reservaYaToken");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Error HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function crearReserva(datos) {
  return request(API_URL, {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export async function obtenerMisReservas() {
  return request(`${API_URL}/mis-reservas`);
}
