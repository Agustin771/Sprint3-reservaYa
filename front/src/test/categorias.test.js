import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obtenerCategorias, crearCategoria, eliminarCategoria } from '../services/categorias';

describe('Servicios de Categorías (categorias.js)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debería obtener la lista de categorías con token', async () => {
    const categoriasMock = [{ id: 1, nombre: 'Hoteles' }, { id: 2, nombre: 'Vuelos' }];
    localStorage.setItem('reservaYaToken', 'token-admin-abc');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(categoriasMock),
      json: async () => categoriasMock,
    });

    const resultado = await obtenerCategorias();

    expect(resultado).toEqual(categoriasMock);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/categorias',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-admin-abc',
        }),
      })
    );
  });

  it('debería crear una nueva categoría vía POST', async () => {
    const nuevaCat = { id: 3, nombre: 'Autos' };
    localStorage.setItem('reservaYaToken', 'token-admin-abc');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      text: async () => JSON.stringify(nuevaCat),
      json: async () => nuevaCat,
    });

    const resultado = await crearCategoria('Autos');

    expect(resultado).toEqual(nuevaCat);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/categorias',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ nombre: 'Autos' }),
      })
    );
  });
});