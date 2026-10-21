
package com.reservaYa.RYV1.Controller;

import com.reservaYa.RYV1.dto.FavoritoDTO;
import com.reservaYa.RYV1.Service.FavoritoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @GetMapping
    public ResponseEntity<List<FavoritoDTO>> obtenerFavoritos(
            Authentication authentication) {

        return ResponseEntity.ok(
                favoritoService.obtenerFavoritos(authentication)
        );
    }

    @PostMapping("/{productoId}")
    public ResponseEntity<Void> agregarFavorito(
            @PathVariable Long productoId,
            Authentication authentication) {

        favoritoService.agregarFavorito(
                productoId, authentication
        );

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{productoId}")
    public ResponseEntity<Void> quitarFavorito(
            @PathVariable Long productoId,
            Authentication authentication) {

        favoritoService.quitarFavorito(
                productoId, authentication
        );

        return ResponseEntity.noContent().build();
    }
}
