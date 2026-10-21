package com.reservaYa.RYV1.Repository;

import com.reservaYa.RYV1.Model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservaRepository
        extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuario_IdOrderByFechaReservaDesc(
            Long usuarioId
    );

    boolean existsBySalida_Producto_Id(Long productoId);

    boolean existsBySalida_Id(Long salidaId);
}