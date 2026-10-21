import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obtenerSalidas, crearSalida, eliminarSalida } from '../services/salidas';

describe('Servicio de Salidas (salidas.js)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debería obtener la lista de salidas de un producto', async () => {
    const salidasMock = [{ id: 1, fechaIda: '2026-12-01', cuposTotales: 20 }];
    localStorage.setItem('reservaYaToken', 'token-admin-salidas');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => salidasMock,
    });

    const resultado = await obtenerSalidas(3);

    expect(resultado).toEqual(salidasMock);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/productos/3/salidas',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-admin-salidas',
        }),
      })
    );
  });

  it('debería crear una salida para un producto vía POST', async () => {
    const nuevaSalida = { fechaIda: '2026-12-01', fechaRegreso: '2026-12-07', cuposTotales: 15 };
    localStorage.setItem('reservaYaToken', 'token-admin-salidas');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 5, ...nuevaSalida }),
    });

    await crearSalida(3, nuevaSalida);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/productos/3/salidas',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(nuevaSalida),
      })
    );
  });

  it('debería eliminar una salida específica vía DELETE', async () => {
    localStorage.setItem('reservaYaToken', 'token-admin-salidas');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    });

    await eliminarSalida(3, 5);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/productos/3/salidas/5',
      expect.objectContaining({
        method: 'DELETE',
      })
    );
  });
});