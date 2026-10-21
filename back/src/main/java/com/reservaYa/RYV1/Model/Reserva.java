package com.reservaYa.RYV1.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "salida_id", nullable = false)
    private SalidaPaquete salida;

    @Column(name = "cantidad_cupos", nullable = false)
    private Integer cantidadCupos;

    @Column(name = "fecha_reserva", nullable = false)
    private LocalDateTime fechaReserva;

    @Column(nullable = false, length = 30)
    private String estado;

    public Reserva() {
    }

    public Long getId() {
        return id;
    }

    public User getUsuario() {
        return usuario;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    public SalidaPaquete getSalida() {
        return salida;
    }

    public void setSalida(SalidaPaquete salida) {
        this.salida = salida;
    }

    public Integer getCantidadCupos() {
        return cantidadCupos;
    }

    public void setCantidadCupos(Integer cantidadCupos) {
        this.cantidadCupos = cantidadCupos;
    }

    public LocalDateTime getFechaReserva() {
        return fechaReserva;
    }

    public void setFechaReserva(LocalDateTime fechaReserva) {
        this.fechaReserva = fechaReserva;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}