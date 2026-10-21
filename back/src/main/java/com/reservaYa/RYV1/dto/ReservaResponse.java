package com.reservaYa.RYV1.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReservaResponse {

    private Long id;
    private Long salidaId;
    private String productoNombre;
    private LocalDate fechaIda;
    private LocalDate fechaRegreso;
    private Integer cantidadCupos;
    private LocalDateTime fechaReserva;
    private String estado;

    public ReservaResponse(
            Long id,
            Long salidaId,
            String productoNombre,
            LocalDate fechaIda,
            LocalDate fechaRegreso,
            Integer cantidadCupos,
            LocalDateTime fechaReserva,
            String estado) {
        this.id = id;
        this.salidaId = salidaId;
        this.productoNombre = productoNombre;
        this.fechaIda = fechaIda;
        this.fechaRegreso = fechaRegreso;
        this.cantidadCupos = cantidadCupos;
        this.fechaReserva = fechaReserva;
        this.estado = estado;
    }

    public Long getId() { return id; }
    public Long getSalidaId() { return salidaId; }
    public String getProductoNombre() { return productoNombre; }
    public LocalDate getFechaIda() { return fechaIda; }
    public LocalDate getFechaRegreso() { return fechaRegreso; }
    public Integer getCantidadCupos() { return cantidadCupos; }
    public LocalDateTime getFechaReserva() { return fechaReserva; }
    public String getEstado() { return estado; }
}