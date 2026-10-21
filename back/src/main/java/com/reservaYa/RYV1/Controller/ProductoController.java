package com.reservaYa.RYV1.Controller;

import com.reservaYa.RYV1.Model.Producto;
import com.reservaYa.RYV1.Model.SalidaPaquete;
import com.reservaYa.RYV1.Service.ProductoService;
import com.reservaYa.RYV1.dto.SalidaPaqueteRequest;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<Producto> listarTodos() {
        return productoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(
            @PathVariable Long id) {

        return productoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Producto> crear(
            @RequestBody Producto producto) {

        Producto nuevo = productoService.crear(producto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevo);
    }

    @DeleteMapping("/{productoId}/salidas/{salidaId}")
    public ResponseEntity<Void> eliminarSalida(
            @PathVariable Long productoId,
            @PathVariable Long salidaId) {

        productoService.eliminarSalida(productoId, salidaId);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(
            @PathVariable Long id,
            @RequestBody Producto datos) {

        return productoService.actualizar(id, datos)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id) {

        boolean eliminado = productoService.eliminar(id);

        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/salidas")
    public List<SalidaPaquete> listarSalidas(
            @PathVariable("id") Long productoId) {

        return productoService.listarPorProducto(productoId);
    }

    @GetMapping("/{id}/salidas/disponibles")
    public List<SalidaPaquete> listarSalidasDisponibles(
            @PathVariable("id") Long productoId,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate desde,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate hasta) {

        return productoService.listarDisponibles(
                productoId,
                desde,
                hasta
        );
    }

    @PostMapping("/{id}/salidas")
    public ResponseEntity<SalidaPaquete> crearSalida(
            @PathVariable("id") Long productoId,
            @RequestBody SalidaPaqueteRequest datos) {

        SalidaPaquete nuevaSalida =
                productoService.crearSalida(productoId, datos);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevaSalida);
    }

    @GetMapping("/buscar-disponibles")
    public List<Producto> buscarDisponibles(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate desde,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate hasta) {

        return productoService.buscarDisponiblesEnRango(
                desde,
                hasta
        );
    }
}