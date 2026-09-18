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
    public Videojuego crear(Videojuego juego) { validar(juego); return repository.save(juego); }
    public Videojuego actualizar(Long id, Videojuego datos) { validar(datos); Videojuego juego = buscar(id); juego.setTitulo(datos.getTitulo()); juego.setGenero(datos.getGenero()); juego.setPlataforma(datos.getPlataforma()); juego.setPrecio(datos.getPrecio()); juego.setAnioLanzamiento(datos.getAnioLanzamiento()); juego.setPortadaUrl(datos.getPortadaUrl()); return repository.save(juego); }
    public void eliminar(Long id) { repository.delete(buscar(id)); }
    private void validar(Videojuego juego) { if (juego == null || juego.getTitulo() == null || juego.getTitulo().isBlank() || juego.getGenero() == null || juego.getGenero().isBlank() || juego.getPlataforma() == null || juego.getPlataforma().isBlank() || juego.getPrecio() == null || juego.getPrecio() < 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Título, género, plataforma y precio válido son obligatorios"); }
}
