// Inicio: presenta un resumen de la tienda y solamente los juegos del catálogo propio.
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Coleccion } from '../models/coleccion';
import { Videojuego } from '../models/videojuego';
import { ColeccionService } from '../services/coleccion.service';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-dashboard-page', standalone: true, imports: [CommonModule], template: `
    <section class="intro"><div><p class="eyebrow">GAMEVAULT · TIENDA ONLINE</p><h1>Tu próxima partida empieza aquí.</h1></div><p>Explora únicamente los videojuegos publicados en nuestro catálogo.</p></section>
    <section class="metrics" aria-label="Resumen de la tienda"><article><strong>{{ juegos.length }}</strong><span>Juegos disponibles</span></article><article><strong>{{ pedidos.length }}</strong><span>Pedidos registrados</span></article><article><strong>{{ confirmados }}</strong><span>Pedidos confirmados</span></article><article><strong>{{ cancelados }}</strong><span>Pedidos cancelados</span></article></section>
    <section class="panel catalog-home"><div class="panel-heading"><div><p class="eyebrow">CATÁLOGO</p><h2>Juegos disponibles</h2></div><span class="badge">{{ juegos.length }} juegos</span></div><div class="catalog-grid">@for (juego of juegos; track juego.id) {<article class="game-card"><img [src]="juego.portadaUrl || 'https://placehold.co/720x420/101326/eaf7ff?text=GAMEVAULT'" [alt]="juego.titulo"><div><span class="badge">{{ juego.genero }}</span><h3>{{ juego.titulo }}</h3><p>{{ juego.plataforma }} · {{ juego.anioLanzamiento || 'Próximamente' }}</p></div></article>} @empty {<p class="empty catalog-empty">No hay videojuegos ingresados en el catálogo. Agrega uno desde “Catálogo” para verlo aquí.</p>}</div></section>`
})
export class DashboardPageComponent implements OnInit {
  // Servicios que recuperan los datos persistidos por Spring Boot.
  private readonly juegosService = inject(ProductoService);
  private readonly pedidosService = inject(ColeccionService);
  juegos: Videojuego[] = [];
  pedidos: Coleccion[] = [];

  // Carga el catálogo y los pedidos al abrir Inicio.
  ngOnInit(): void {
    this.juegosService.listar().subscribe({ next: juegos => this.juegos = juegos, error: () => this.juegos = [] });
    this.pedidosService.listar().subscribe({ next: pedidos => this.pedidos = pedidos, error: () => this.pedidos = [] });
  }

  // Contadores derivados para los indicadores superiores.
  get confirmados(): number { return this.pedidos.filter(pedido => pedido.estado === 'CONFIRMADO').length; }
  get cancelados(): number { return this.pedidos.filter(pedido => pedido.estado === 'CANCELADO').length; }
}
