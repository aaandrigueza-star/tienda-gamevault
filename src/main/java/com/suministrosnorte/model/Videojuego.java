package com.suministrosnorte.model;

// Entidad persistente que representa cada videojuego publicado en la tienda.

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class Videojuego {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String genero;
    @Lob
    @Column(columnDefinition = "CLOB")
    private String descripcion;
    private String categoria;
    private String plataforma;
    private String formato;
    private Integer xboxUnidades;
    private Integer playstationUnidades;
    private Integer nintendoUnidades;
    // Precio de venta del videojuego, usado para calcular el total de los pedidos.
    private Double precio;
    private Integer anioLanzamiento;
    @Lob
    @Column(columnDefinition = "CLOB")
    private String portadaUrl;

    public Videojuego() { }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; } public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getGenero() { return genero; } public void setGenero(String genero) { this.genero = genero; }
    public String getDescripcion() { return descripcion; } public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getCategoria() { return categoria; } public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getPlataforma() { return plataforma; } public void setPlataforma(String plataforma) { this.plataforma = plataforma; }
    public String getFormato() { return formato; } public void setFormato(String formato) { this.formato = formato; }
    public Integer getXboxUnidades() { return xboxUnidades; } public void setXboxUnidades(Integer xboxUnidades) { this.xboxUnidades = xboxUnidades; }
    public Integer getPlaystationUnidades() { return playstationUnidades; } public void setPlaystationUnidades(Integer playstationUnidades) { this.playstationUnidades = playstationUnidades; }
    public Integer getNintendoUnidades() { return nintendoUnidades; } public void setNintendoUnidades(Integer nintendoUnidades) { this.nintendoUnidades = nintendoUnidades; }
    public Double getPrecio() { return precio; } public void setPrecio(Double precio) { this.precio = precio; }
    public Integer getAnioLanzamiento() { return anioLanzamiento; } public void setAnioLanzamiento(Integer anioLanzamiento) { this.anioLanzamiento = anioLanzamiento; }
    public String getPortadaUrl() { return portadaUrl; } public void setPortadaUrl(String portadaUrl) { this.portadaUrl = portadaUrl; }
}
