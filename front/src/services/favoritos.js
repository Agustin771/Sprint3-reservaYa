const API_URL = "/api/favoritos";

function obtenerToken() {
  return localStorage.getItem("reservaYaToken");
}

async function request(url, options = {}) {
  const token = obtenerToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
  });

  if (!response.ok) {
    const mensaje = await response.text();
    throw new Error(
      mensaje || `Error ${response.status} al gestionar favoritos.`
    );
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function obtenerFavoritos() {
  return request(API_URL);
}

export async function agregarFavorito(productoId) {
  return request(`${API_URL}/${productoId}`, {
    method: "POST",
  });
}

export async function quitarFavorito(productoId) {
  return request(`${API_URL}/${productoId}`, {
    method: "DELETE",
  });
}