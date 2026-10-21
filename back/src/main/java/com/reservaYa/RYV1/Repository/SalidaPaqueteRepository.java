package com.reservaYa.RYV1.Repository;

import com.reservaYa.RYV1.Model.Producto;
import com.reservaYa.RYV1.Model.SalidaPaquete;
import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

import java.time.LocalDate;
import java.util.List;

public interface SalidaPaqueteRepository
        extends JpaRepository<SalidaPaquete, Long> {

    List<SalidaPaquete> findByProductoIdOrderByFechaIdaAsc(
            Long productoId
    );

    void deleteAllByProducto_Id(Long productoId);
    boolean existsByProducto_Id(Long productoId);
    void deleteByIdAndProducto_Id(Long salidaId, Long productoId);

    List<SalidaPaquete>
    findByProductoIdAndFechaIdaBetweenAndCuposDisponiblesGreaterThanOrderByFechaIdaAsc(
            Long productoId,
            LocalDate desde,
            LocalDate hasta,
            Integer cuposMinimos
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT s FROM SalidaPaquete s
    WHERE s.id = :salidaId
    """)
    Optional<SalidaPaquete> buscarPorIdParaReservar(
            @Param("salidaId") Long salidaId
    );

    @Query("""
    SELECT DISTINCT s.producto
    FROM SalidaPaquete s
    WHERE s.fechaIda >= :desde
      AND s.fechaIda <= :hasta
      AND s.cuposDisponibles > 0
    """)
    List<Producto> buscarProductosDisponiblesEnRango(
            @Param("desde") LocalDate desde,
            @Param("hasta") LocalDate hasta
    );
}
