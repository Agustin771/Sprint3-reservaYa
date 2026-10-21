import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../services/favoritos';

describe('Servicio de Favoritos (favoritos.js)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debería obtener la lista de favoritos correctamente', async () => {
    const favoritosMock = [{ id: 1, name: 'Hotel Cabañas' }];
    localStorage.setItem('reservaYaToken', 'token-fav-123');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(favoritosMock),
    });

    const resultado = await obtenerFavoritos();

    expect(resultado).toEqual(favoritosMock);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/favoritos',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-fav-123',
        }),
      })
    );
  });

  it('debería agregar un producto a favoritos vía POST', async () => {
    localStorage.setItem('reservaYaToken', 'token-fav-123');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ success: true }),
    });

    await agregarFavorito(5);

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/favoritos/5',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('debería quitar un producto de favoritos vía DELETE', async () => {
    localStorage.setItem('reservaYaToken', 'token-fav-123');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      text: async () => '',
    });

    const resultado = await quitarFavorito(5);

    expect(resultado).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/favoritos/5',
      expect.objectContaining({
        method: 'DELETE',
      })
    );
  });
});