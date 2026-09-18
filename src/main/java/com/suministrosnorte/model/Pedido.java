package com.suministrosnorte.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

// Detalle de un pedido: cada juego con su cantidad y precio al momento de la compra.
@Entity
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el pedido padre
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coleccion_id")
    @JsonBackReference
    private Coleccion coleccion;

    // ID del videojuego comprado
    private Long videojuegoId;

    // Título del juego (para no depender del catálogo si se borra)
    private String titulo;

    // Precio unitario al momento de la compra
    private Double precioUnitario;

    // Cantidad comprada
    private Integer cantidad;

    public DetallePedido() { }

    public DetallePedido(Long videojuegoId, String titulo, Double precioUnitario, Integer cantidad) {
        this.videojuegoId = videojuegoId;
        this.titulo = titulo;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
    }

    // Subtotal calculado
    public Double getSubtotal() {
        return precioUnitario != null && cantidad != null ? precioUnitario * cantidad : 0.0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Coleccion getColeccion() { return coleccion; }
    public void setColeccion(Coleccion coleccion) { this.coleccion = coleccion; }
    public Long getVideojuegoId() { return videojuegoId; }
    public void setVideojuegoId(Long videojuegoId) { this.videojuegoId = videojuegoId; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}