package com.reservaYa.RYV1.Controller;

import com.reservaYa.RYV1.Service.ReservaService;
import com.reservaYa.RYV1.dto.CrearReservaRequest;
import com.reservaYa.RYV1.dto.ReservaResponse;
import com.reservaYa.RYV1.security.services.UserDetailsImpl;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaResponse crear(
            @AuthenticationPrincipal UserDetailsImpl usuario,
            @Valid @RequestBody CrearReservaRequest datos) {

        return reservaService.crear(usuario.getId(), datos);
    }

    @GetMapping("/mis-reservas")
    public List<ReservaResponse> misReservas(
            @AuthenticationPrincipal UserDetailsImpl usuario) {

        return reservaService.listarPorUsuario(usuario.getId());
    }
}