package com.suministrosnorte.model;

// Entidad persistente que representa cada videojuego publicado en la tienda.

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Videojuego {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String genero;
    private String plataforma;
    // Precio de venta del videojuego, usado para calcular el total de los pedidos.
    private Double precio;
    private Integer anioLanzamiento;
    private String portadaUrl;

    public Videojuego() { }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; } public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getGenero() { return genero; } public void setGenero(String genero) { this.genero = genero; }
    public String getPlataforma() { return plataforma; } public void setPlataforma(String plataforma) { this.plataforma = plataforma; }
    public Double getPrecio() { return precio; } public void setPrecio(Double precio) { this.precio = precio; }
    public Integer getAnioLanzamiento() { return anioLanzamiento; } public void setAnioLanzamiento(Integer anioLanzamiento) { this.anioLanzamiento = anioLanzamiento; }
    public String getPortadaUrl() { return portadaUrl; } public void setPortadaUrl(String portadaUrl) { this.portadaUrl = portadaUrl; }
}
