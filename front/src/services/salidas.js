
const API_URL = "http://localhost:8080/api/productos";

async function request(url, options = {}) {
  const token = localStorage.getItem("reservaYaToken");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
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

export function obtenerSalidas(productoId) {
  return request(`${API_URL}/${productoId}/salidas`);
}

export function obtenerSalidasDisponibles(
  productoId,
  desde,
  hasta
) {
  const params = new URLSearchParams({
    desde,
    hasta,
  });

  return request(
    `${API_URL}/${productoId}/salidas/disponibles?${params}`
  );
}

export function crearSalida(productoId, datos) {
  return request(`${API_URL}/${productoId}/salidas`, {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function eliminarSalida(productoId, salidaId) {
  return request(
    `${API_URL}/${productoId}/salidas/${salidaId}`,
    {
      method: "DELETE",
    }
  );
}
