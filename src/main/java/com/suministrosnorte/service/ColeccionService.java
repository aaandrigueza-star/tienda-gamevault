package com.suministrosnorte.service;

import com.suministrosnorte.model.Coleccion;
import com.suministrosnorte.model.DetallePedido;
import com.suministrosnorte.model.Videojuego;
import com.suministrosnorte.repository.ColeccionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ColeccionService {

    private final ColeccionRepository repository;
    private final VideojuegoService videojuegos;

    public ColeccionService(ColeccionRepository repository, VideojuegoService videojuegos) {
        this.repository = repository;
        this.videojuegos = videojuegos;
    }

    public List<Coleccion> listar() {
        return repository.findAll();
    }

    // Crea un pedido con varios juegos, validando stock y calculando total.
    public Coleccion crear(Coleccion item) {

        // 1. Validaciones básicas
        if (item == null || item.getJugador() == null || item.getJugador().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del cliente es obligatorio");
        }
        if (item.getCorreo() == null || !item.getCorreo().contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo es obligatorio y debe ser válido");
        }
        if (item.getDetalles() == null || item.getDetalles().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debes agregar al menos un videojuego al pedido");
        }
        if (item.getEstado() == null || item.getEstado().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El estado es obligatorio");
        }

        // 2. Validar y enriquecer cada detalle
        double total = 0.0;
        for (DetallePedido detalle : item.getDetalles()) {
            if (detalle.getVideojuegoId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cada detalle debe tener un videojuego");
            }
            if (detalle.getCantidad() == null || detalle.getCantidad() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor a cero");
            }

            // Buscar el videojuego para obtener su precio actual
            Videojuego juego = videojuegos.buscar(detalle.getVideojuegoId());

            // Rellenar datos del detalle con info del videojuego
            detalle.setTitulo(juego.getTitulo());
            detalle.setPrecioUnitario(juego.getPrecio());
            detalle.setColeccion(item);

            total += juego.getPrecio() * detalle.getCantidad();
        }

        // 3. Establecer total y plataforma por defecto
        item.setTotal(total);
        if (item.getPlataforma() == null || item.getPlataforma().isBlank()) {
            item.setPlataforma("Digital");
        }

        // 4. Guardar (cascade guarda los detalles automáticamente)
        return repository.save(item);
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado");
        }
        repository.deleteById(id);
    }
}