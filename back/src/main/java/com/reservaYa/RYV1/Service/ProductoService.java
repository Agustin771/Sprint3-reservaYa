
package com.reservaYa.RYV1.Service;

import com.reservaYa.RYV1.Model.Categoria;
import com.reservaYa.RYV1.Model.Producto;
import com.reservaYa.RYV1.Model.SalidaPaquete;
import com.reservaYa.RYV1.Repository.CategoriaRepository;
import com.reservaYa.RYV1.Repository.ProductRepository;
import com.reservaYa.RYV1.Repository.SalidaPaqueteRepository;
import com.reservaYa.RYV1.dto.SalidaPaqueteRequest;
import com.reservaYa.RYV1.Repository.FavoritoRepository;
import com.reservaYa.RYV1.Repository.ReservaRepository;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductRepository productRepository;
    private final CategoriaRepository categoriaRepository;
    private final SalidaPaqueteRepository salidaRepository;
    private final FavoritoRepository favoritoRepository;
    private final ReservaRepository reservaRepository;

    public ProductoService(
            ProductRepository productRepository,
            CategoriaRepository categoriaRepository,
            SalidaPaqueteRepository salidaRepository,
            FavoritoRepository favoritoRepository,
            ReservaRepository reservaRepository) {
        this.productRepository = productRepository;
        this.categoriaRepository = categoriaRepository;
        this.salidaRepository = salidaRepository;
        this.favoritoRepository = favoritoRepository;
        this.reservaRepository = reservaRepository;
    }

    @Transactional(readOnly = true)
    public List<Producto> listarTodos() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Producto> buscarPorId(Long id) {
        return productRepository.findById(id);
    }

    private Categoria resolverCategoria(Categoria categoria) {
        if (categoria == null) {
            return null;
        }

        if (categoria.getId() != null) {
            return categoriaRepository.findById(categoria.getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "La categoría indicada no existe"
                    ));
        }

        if (categoria.getNombre() != null
                && !categoria.getNombre().isBlank()) {

            String nombre = categoria.getNombre().trim();

            return categoriaRepository.findByNombreIgnoreCase(nombre)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "La categoría indicada no existe"
                    ));
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Debés indicar una categoría válida"
        );
    }

    @Transactional
    public Producto crear(Producto producto) {
        producto.setId(null);

        producto.setCategoria(
                resolverCategoria(producto.getCategoria())
        );

        if (producto.getImages() != null
                && !producto.getImages().isEmpty()) {
            producto.setImagen(producto.getImages().get(0));
        }

        return productRepository.save(producto);
    }

    @Transactional
    public void eliminarSalida(Long productoId, Long salidaId) {

        if (!productRepository.existsById(productoId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "El producto no existe"
            );
        }

        SalidaPaquete salida = salidaRepository.findById(salidaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "La salida no existe"
                ));

        if (!salida.getProducto().getId().equals(productoId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "La salida no pertenece a este producto"
            );
        }

        if (reservaRepository.existsBySalida_Id(salidaId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede eliminar esta salida porque tiene reservas asociadas."
            );
        }

        salidaRepository.delete(salida);
        salidaRepository.flush();
    }

    @Transactional
    public Optional<Producto> actualizar(Long id, Producto datos) {
        return productRepository.findById(id)
                .map(producto -> {
                    producto.setNombre(datos.getNombre());

                    producto.setCategoria(
                            resolverCategoria(datos.getCategoria())
                    );

                    producto.setUbicacion(datos.getUbicacion());
                    producto.setPrecio(datos.getPrecio());
                    producto.setDescripcion(datos.getDescripcion());
                    producto.setImages(datos.getImages());

                    if (datos.getImages() != null
                            && !datos.getImages().isEmpty()) {
                        producto.setImagen(datos.getImages().get(0));
                    } else {
                        producto.setImagen(datos.getImagen());
                    }

                    return productRepository.save(producto);
                });
    }

    @Transactional
    public boolean eliminar(Long id) {
        Producto producto = productRepository.findById(id)
                .orElse(null);

        if (producto == null) {
            return false;
        }

        if (reservaRepository.existsBySalida_Producto_Id(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede eliminar este producto porque tiene reservas asociadas. Desactivalo para conservar el historial."
            );
        }

        favoritoRepository.deleteAllByProducto_Id(id);

        salidaRepository.deleteAllByProducto_Id(id);

        try {
            productRepository.delete(producto);
            productRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede eliminar el producto porque tiene otros registros asociados.",
                    e
            );
        }

        return true;
    }

    @Transactional(readOnly = true)
    public List<SalidaPaquete> listarPorProducto(Long productoId) {
        if (!productRepository.existsById(productoId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "El producto no existe"
            );
        }

        return salidaRepository.findByProductoIdOrderByFechaIdaAsc(
                productoId
        );
    }

    @Transactional(readOnly = true)
    public List<SalidaPaquete> listarDisponibles(
            Long productoId,
            LocalDate desde,
            LocalDate hasta) {

        if (desde == null || hasta == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debés indicar la fecha desde y hasta"
            );
        }

        if (hasta.isBefore(desde)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha hasta no puede ser anterior a la fecha desde"
            );
        }

        if (!productRepository.existsById(productoId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "El producto no existe"
            );
        }

        return salidaRepository
                .findByProductoIdAndFechaIdaBetweenAndCuposDisponiblesGreaterThanOrderByFechaIdaAsc(
                        productoId,
                        desde,
                        hasta,
                        0
                );
    }

    @Transactional(readOnly = true)
    public List<Producto> buscarDisponiblesEnRango(
            LocalDate desde,
            LocalDate hasta) {

        if (desde == null || hasta == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debés indicar ambas fechas"
            );
        }

        if (hasta.isBefore(desde)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha hasta no puede ser anterior a la fecha desde"
            );
        }

        if (desde.isBefore(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha desde no puede estar en el pasado"
            );
        }

        return salidaRepository.buscarProductosDisponiblesEnRango(
                desde,
                hasta
        );
    }

    @Transactional
    public SalidaPaquete crearSalida(
            Long productoId,
            SalidaPaqueteRequest datos) {

        if (datos == null
                || datos.getFechaIda() == null
                || datos.getFechaRegreso() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debés indicar las fechas de ida y regreso"
            );
        }

        if (datos.getFechaRegreso().isBefore(datos.getFechaIda())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de regreso no puede ser anterior a la fecha de ida"
            );
        }

        if (datos.getFechaIda().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de ida no puede estar en el pasado"
            );
        }

        if (datos.getCuposTotales() == null
                || datos.getCuposTotales() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los cupos totales deben ser mayores que cero"
            );
        }

        Producto producto = productRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El producto no existe"
                ));

        SalidaPaquete salida = new SalidaPaquete();
        salida.setProducto(producto);
        salida.setFechaIda(datos.getFechaIda());
        salida.setFechaRegreso(datos.getFechaRegreso());
        salida.setCuposTotales(datos.getCuposTotales());
        salida.setCuposDisponibles(datos.getCuposTotales());

        return salidaRepository.save(salida);
    }
}
