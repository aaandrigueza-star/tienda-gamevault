package com.suministrosnorte.repository;
// Repositorio JPA: guarda y consulta los pedidos registrados en la tienda.
import com.suministrosnorte.model.Coleccion;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ColeccionRepository extends JpaRepository<Coleccion, Long> { }
