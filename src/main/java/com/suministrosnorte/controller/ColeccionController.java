package com.suministrosnorte.controller;
// API REST de pedidos; permite listar, crear y eliminar compras de la tienda.
import com.suministrosnorte.model.Coleccion;
import com.suministrosnorte.service.ColeccionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/colecciones")
public class ColeccionController {
 private final ColeccionService service; public ColeccionController(ColeccionService service) { this.service = service; }
 @GetMapping public List<Coleccion> listar() { return service.listar(); }
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Coleccion crear(@RequestBody Coleccion item) { return service.crear(item); }
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}
