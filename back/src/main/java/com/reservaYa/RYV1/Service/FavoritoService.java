package com.reservaYa.RYV1.Service;

import com.reservaYa.RYV1.Repository.ProductRepository;
import com.reservaYa.RYV1.dto.FavoritoDTO;
import com.reservaYa.RYV1.Model.Favorito;
import com.reservaYa.RYV1.Model.Producto;
import com.reservaYa.RYV1.Model.User;
import com.reservaYa.RYV1.Repository.FavoritoRepository;
import com.reservaYa.RYV1.Repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public FavoritoService(
            FavoritoRepository favoritoRepository,
            UserRepository userRepository,
            ProductRepository productoRepository) {
        this.favoritoRepository = favoritoRepository;
        this.userRepository = userRepository;
        this.productRepository = productoRepository;
    }

    private User obtenerUsuarioAutenticado(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Debés iniciar sesión."
            );
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "No se encontró el usuario autenticado."
                ));
    }

    @Transactional(readOnly = true)
    public List<FavoritoDTO> obtenerFavoritos(
            Authentication authentication) {

        User user = obtenerUsuarioAutenticado(authentication);

        return favoritoRepository.findAllByUser(user)
                .stream()
                .map(favorito -> convertirDTO(favorito.getProducto()))
                .toList();
    }

    @Transactional
    public void agregarFavorito(
            Long productoId,
            Authentication authentication) {

        User user = obtenerUsuarioAutenticado(authentication);

        if (favoritoRepository.existsByUserAndProducto_Id(
                user, productoId)) {
            return;
        }

        Producto producto = productRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró el producto."
                ));

        favoritoRepository.save(new Favorito(user, producto));
    }

    @Transactional
    public void quitarFavorito(
            Long productoId,
            Authentication authentication) {

        User user = obtenerUsuarioAutenticado(authentication);

        Favorito favorito = favoritoRepository
                .findByUserAndProducto_Id(user, productoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El producto no está entre tus favoritos."
                ));

        favoritoRepository.delete(favorito);
    }

    private FavoritoDTO convertirDTO(Producto producto) {
        return new FavoritoDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getCategoria() == null
                        ? null
                        : producto.getCategoria().getNombre(),
                producto.getUbicacion(),
                producto.getPrecio(),
                producto.getImagen(),
                producto.getDescripcion()
        );
    }
}
