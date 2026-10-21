import { describe, it, expect, vi, beforeEach } from 'vitest';
import { crearReserva, obtenerMisReservas } from '../services/reservas';

describe('Servicio de Reservas (reservas.js)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debería crear una reserva enviando los datos por POST', async () => {
    const datosReserva = { productoId: 1, fechaIda: '2026-11-01', fechaRegreso: '2026-11-05' };
    const respuestaMock = { id: 10, ...datosReserva };
    localStorage.setItem('reservaYaToken', 'token-reserva-abc');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => respuestaMock,
    });

    const resultado = await crearReserva(datosReserva);

    expect(resultado).toEqual(respuestaMock);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/reservas',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(datosReserva),
        headers: expect.objectContaining({
          Authorization: 'Bearer token-reserva-abc',
        }),
      })
    );
  });

  it('debería obtener las reservas del usuario actual', async () => {
    const misReservasMock = [{ id: 1, producto: 'Hotel' }];
    localStorage.setItem('reservaYaToken', 'token-reserva-abc');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => misReservasMock,
    });

    const resultado = await obtenerMisReservas();

    expect(resultado).toEqual(misReservasMock);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/reservas/mis-reservas',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-reserva-abc',
        }),
      })
    );
  });
});