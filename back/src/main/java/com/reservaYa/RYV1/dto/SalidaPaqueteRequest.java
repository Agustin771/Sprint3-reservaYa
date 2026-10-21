
package com.reservaYa.RYV1.dto;

import java.time.LocalDate;

public class SalidaPaqueteRequest {

    private LocalDate fechaIda;
    private LocalDate fechaRegreso;
    private Integer cuposTotales;

    public SalidaPaqueteRequest() {
    }

    public LocalDate getFechaIda() {
        return fechaIda;
    }

    public void setFechaIda(LocalDate fechaIda) {
        this.fechaIda = fechaIda;
    }

    public LocalDate getFechaRegreso() {
        return fechaRegreso;
    }

    public void setFechaRegreso(LocalDate fechaRegreso) {
        this.fechaRegreso = fechaRegreso;
    }

    public Integer getCuposTotales() {
        return cuposTotales;
    }

    public void setCuposTotales(Integer cuposTotales) {
        this.cuposTotales = cuposTotales;
    }
}
