package com.suministrosnorte.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Coleccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jugador;
    private String correo;
    private String estado;
    private String plataforma;
    private Double total;

    // Lista de juegos del pedido
    @OneToMany(mappedBy = "coleccion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<DetallePedido> detalles = new ArrayList<>();

    public Coleccion() { }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getJugador() { return jugador; }
    public void setJugador(String jugador) { this.jugador = jugador; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getPlataforma() { return plataforma; }
    public void setPlataforma(String plataforma) { this.plataforma = plataforma; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public List<DetallePedido> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedido> detalles) { this.detalles = detalles; }

    // Método helper para agregar detalle manteniendo la relación bidireccional
    public void agregarDetalle(DetallePedido detalle) {
        detalle.setColeccion(this);
        this.detalles.add(detalle);
    }
}