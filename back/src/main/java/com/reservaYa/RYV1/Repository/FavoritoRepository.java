package com.reservaYa.RYV1.Repository;

import com.reservaYa.RYV1.Model.Favorito;
import com.reservaYa.RYV1.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritoRepository
        extends JpaRepository<Favorito, Long> {

    List<Favorito> findAllByUser(User user);

    Optional<Favorito> findByUserAndProducto_Id(
            User user,
            Long productoId
    );

    boolean existsByUserAndProducto_Id(
            User user,
            Long productoId
    );

    void deleteAllByProducto_Id(Long productoId);
}
