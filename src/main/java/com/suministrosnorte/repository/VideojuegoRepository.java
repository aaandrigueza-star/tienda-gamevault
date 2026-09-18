package com.suministrosnorte.repository;
// Repositorio JPA: proporciona operaciones de base de datos para videojuegos.
import com.suministrosnorte.model.Videojuego;
import org.springframework.data.jpa.repository.JpaRepository;
public interface VideojuegoRepository extends JpaRepository<Videojuego, Long> { }
