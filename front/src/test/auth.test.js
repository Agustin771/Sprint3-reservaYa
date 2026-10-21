import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registrarUsuario, iniciarSesion } from '../services/auth';

describe('Servicio de Autenticación (auth.js)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería registrar un usuario correctamente', async () => {
    const usuarioNuevo = { email: 'agus@reservaya.com', password: '123' };
    const respuestaMock = { message: 'Usuario registrado con éxito' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(respuestaMock),
    });

    const resultado = await registrarUsuario(usuarioNuevo);

    expect(resultado).toEqual(respuestaMock);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/auth/register',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(usuarioNuevo),
      })
    );
  });

  it('debería iniciar sesión y devolver el token/datos de acceso', async () => {
    const credenciales = { email: 'agus@reservaya.com', password: '123' };
    const respuestaLogin = { token: 'jwt-token-valido-987' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(respuestaLogin),
    });

    const resultado = await iniciarSesion(credenciales);

    expect(resultado).toEqual(respuestaLogin);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(credenciales),
      })
    );
  });
});