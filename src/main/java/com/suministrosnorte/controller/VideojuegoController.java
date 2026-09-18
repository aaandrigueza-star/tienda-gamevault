package com.suministrosnorte.controller;
// API REST del catálogo; expone GET, POST, PUT y DELETE para videojuegos.
import com.suministrosnorte.model.Videojuego;
import com.suministrosnorte.service.VideojuegoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/videojuegos")
public class VideojuegoController {
 private final VideojuegoService service; public VideojuegoController(VideojuegoService service) { this.service = service; }
 @GetMapping public List<Videojuego> listar() { return service.listar(); }
 @GetMapping("/{id}") public Videojuego buscar(@PathVariable Long id) { return service.buscar(id); }
 @PostMapping public ResponseEntity<Videojuego> crear(@RequestBody Videojuego juego) { return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(juego)); }
 @PutMapping("/{id}") public Videojuego actualizar(@PathVariable Long id, @RequestBody Videojuego juego) { return service.actualizar(id, juego); }
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}
