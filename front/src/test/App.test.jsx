import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

vi.mock('../services/productos', () => ({
  obtenerProductos: vi.fn().mockResolvedValue([]),
  buscarProductosDisponibles: vi.fn().mockResolvedValue([]),
}));

vi.mock('../services/categorias', () => ({
  obtenerCategorias: vi.fn().mockResolvedValue([
    { id: 1, nombre: 'Hoteles' },
    { id: 2, nombre: 'Vuelos' }
  ]),
}));

vi.mock('../services/favoritos', () => ({
  obtenerFavoritos: vi.fn().mockResolvedValue([]),
}));

describe('Componente Principal - App', () => {
  it('debería renderizar la barra de navegación y la marca ReservaYa correctamente', async () => {
    render(<App />);

    const brandElements = await screen.findAllByText('ReservaYa');
    expect(brandElements.length).toBeGreaterThan(0);

    expect(screen.getByText('Experiencias sin límites')).toBeInTheDocument();
  });
});