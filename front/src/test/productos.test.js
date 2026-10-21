import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obtenerProductos, crearProducto } from '../services/productos';

describe('Servicios de Productos (productos.js)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debería obtener la lista de productos correctamente con el token en el header', async () => {
    const mockProductos = [
      { id: 1, name: 'Hotel Cabañas del Sur', price: 45000 }
    ];

    localStorage.setItem('reservaYaToken', 'token-falso-123');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockProductos,
    });

    const resultado = await obtenerProductos();

    expect(resultado).toEqual(mockProductos);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/productos',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-falso-123',
        }),
      })
    );
  });

  it('debería enviar un POST para crear un producto', async () => {
    const nuevoProducto = { name: 'Excursión en Catamarán', price: 20000 };
    const productoCreado = { id: 10, ...nuevoProducto };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => productoCreado,
    });

    const resultado = await crearProducto(nuevoProducto);

    expect(resultado).toEqual(productoCreado);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/productos',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(nuevoProducto),
      })
    );
  });
});