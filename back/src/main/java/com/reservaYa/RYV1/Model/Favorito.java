
package com.reservaYa.RYV1.Model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "favoritos",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_favorito_usuario_producto",
                        columnNames = {"user_id", "producto_id"}
                )
        }
)
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    public Favorito() {
    }

    public Favorito(User user, Producto producto) {
        this.user = user;
        this.producto = producto;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}
