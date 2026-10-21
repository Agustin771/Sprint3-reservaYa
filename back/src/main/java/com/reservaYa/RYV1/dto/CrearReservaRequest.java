package com.reservaYa.RYV1.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CrearReservaRequest {

    @NotNull(message = "Debés seleccionar una salida")
    private Long salidaId;

    @NotNull(message = "Debés indicar la cantidad de pasajeros")
    @Min(value = 1, message = "La cantidad debe ser mayor que cero")
    private Integer cantidadCupos;

    public Long getSalidaId() {
        return salidaId;
    }

    public void setSalidaId(Long salidaId) {
        this.salidaId = salidaId;
    }

    public Integer getCantidadCupos() {
        return cantidadCupos;
    }

    public void setCantidadCupos(Integer cantidadCupos) {
        this.cantidadCupos = cantidadCupos;
    }
}
