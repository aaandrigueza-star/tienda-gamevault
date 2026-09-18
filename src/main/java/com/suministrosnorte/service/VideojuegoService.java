package com.suministrosnorte.service;
// Capa de negocio del catálogo: valida los datos antes de persistirlos.
import com.suministrosnorte.model.Videojuego;
import com.suministrosnorte.repository.VideojuegoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class VideojuegoService {
    private final VideojuegoRepository repository;
    public VideojuegoService(VideojuegoRepository repository) { this.repository = repository; }
    public List<Videojuego> listar() { return repository.findAll(); }
    public Videojuego buscar(Long id) { return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Videojuego no encontrado")); }
    public Videojuego crear(Videojuego juego) { validar(juego); completarValores(juego); return repository.save(juego); }
    public Videojuego actualizar(Long id, Videojuego datos) { validar(datos); Videojuego juego = buscar(id); juego.setTitulo(datos.getTitulo()); juego.setGenero(datos.getGenero()); juego.setDescripcion(datos.getDescripcion()); juego.setCategoria(datos.getCategoria()); juego.setPlataforma(datos.getPlataforma()); juego.setFormato(datos.getFormato()); juego.setXboxUnidades(datos.getXboxUnidades()); juego.setPlaystationUnidades(datos.getPlaystationUnidades()); juego.setNintendoUnidades(datos.getNintendoUnidades()); juego.setPrecio(datos.getPrecio()); juego.setAnioLanzamiento(datos.getAnioLanzamiento()); juego.setPortadaUrl(datos.getPortadaUrl()); return repository.save(juego); }
    public void eliminar(Long id) { repository.delete(buscar(id)); }
    private void validar(Videojuego juego) { if (juego == null || juego.getTitulo() == null || juego.getTitulo().isBlank() || juego.getGenero() == null || juego.getGenero().isBlank() || juego.getPlataforma() == null || juego.getPlataforma().isBlank() || juego.getPrecio() == null || juego.getPrecio() < 0 || unidadesInvalidas(juego)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Título, género, plataforma, precio y unidades válidas son obligatorios"); }
    private boolean unidadesInvalidas(Videojuego juego) { return (juego.getXboxUnidades() != null && juego.getXboxUnidades() < 0) || (juego.getPlaystationUnidades() != null && juego.getPlaystationUnidades() < 0) || (juego.getNintendoUnidades() != null && juego.getNintendoUnidades() < 0); }
    private void completarValores(Videojuego juego) { if (juego.getFormato() == null || juego.getFormato().isBlank()) juego.setFormato("DIGITAL"); if (juego.getCategoria() == null || juego.getCategoria().isBlank()) juego.setCategoria("VIDEOJUEGOS"); if (juego.getXboxUnidades() == null) juego.setXboxUnidades(0); if (juego.getPlaystationUnidades() == null) juego.setPlaystationUnidades(0); if (juego.getNintendoUnidades() == null) juego.setNintendoUnidades(0); }
}
