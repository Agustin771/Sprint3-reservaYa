package com.reservaYa.RYV1.Service;

import com.reservaYa.RYV1.Model.Reserva;
import com.reservaYa.RYV1.Model.SalidaPaquete;
import com.reservaYa.RYV1.Model.User;
import com.reservaYa.RYV1.Repository.ReservaRepository;
import com.reservaYa.RYV1.Repository.SalidaPaqueteRepository;
import com.reservaYa.RYV1.Repository.UserRepository;
import com.reservaYa.RYV1.dto.CrearReservaRequest;
import com.reservaYa.RYV1.dto.ReservaResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final SalidaPaqueteRepository salidaRepository;
    private final UserRepository userRepository;

    public ReservaService(
            ReservaRepository reservaRepository,
            SalidaPaqueteRepository salidaRepository,
            UserRepository userRepository) {
        this.reservaRepository = reservaRepository;
        this.salidaRepository = salidaRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReservaResponse crear(
            Long usuarioId,
            CrearReservaRequest datos) {

        User usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "No se encontró el usuario autenticado"
                ));

        SalidaPaquete salida = salidaRepository
                .buscarPorIdParaReservar(datos.getSalidaId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "La salida seleccionada no existe"
                ));

        int cantidad = datos.getCantidadCupos();

        if (cantidad <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La cantidad de pasajeros debe ser mayor que cero"
            );
        }

        if (salida.getCuposDisponibles() == null
                || salida.getCuposDisponibles() < cantidad) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No hay suficientes cupos disponibles para esa salida"
            );
        }

        salida.setCuposDisponibles(
                salida.getCuposDisponibles() - cantidad
        );

        Reserva reserva = new Reserva();
        reserva.setUsuario(usuario);
        reserva.setSalida(salida);
        reserva.setCantidadCupos(cantidad);
        reserva.setFechaReserva(LocalDateTime.now());
        reserva.setEstado("CONFIRMADA");

        // Ambas operaciones se guardan dentro de la misma transacción.
        salidaRepository.save(salida);
        Reserva guardada = reservaRepository.save(reserva);

        return convertirRespuesta(guardada);
    }

    @Transactional(readOnly = true)
    public List<ReservaResponse> listarPorUsuario(Long usuarioId) {

        if (!userRepository.existsById(usuarioId)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "No se encontró el usuario autenticado"
            );
        }

        return reservaRepository
                .findByUsuario_IdOrderByFechaReservaDesc(usuarioId)
                .stream()
                .map(this::convertirRespuesta)
                .toList();
    }

    private ReservaResponse convertirRespuesta(Reserva reserva) {
        SalidaPaquete salida = reserva.getSalida();

        return new ReservaResponse(
                reserva.getId(),
                salida.getId(),
                salida.getProducto().getNombre(),
                salida.getFechaIda(),
                salida.getFechaRegreso(),
                reserva.getCantidadCupos(),
                reserva.getFechaReserva(),
                reserva.getEstado()
        );
    }
}