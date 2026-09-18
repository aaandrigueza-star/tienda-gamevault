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
    <section class="panel catalog-home"><div class="panel-heading"><div><p class="eyebrow">CATÁLOGO</p><h2>Juegos disponibles</h2></div><span class="badge">{{ juegos.length }} juegos</span></div><div class="catalog-grid">@for (juego of juegos; track juego.id) {<article class="game-card"><img [src]="juego.portadaUrl || fallbackPortada" [alt]="juego.titulo" (error)="imagenAlternativa($event)"><div><span class="badge">{{ juego.genero }}</span><h3>{{ juego.titulo }}</h3><p class="game-description">{{ descripcionJuego(juego) }}</p><p>{{ nombreFormato(juego.formato) }} · {{ juego.anioLanzamiento || 'Próximamente' }}</p><small class="stock-summary">Xbox: {{ juego.xboxUnidades || 0 }} · PlayStation: {{ juego.playstationUnidades || 0 }} · Nintendo: {{ juego.nintendoUnidades || 0 }}</small></div></article>} @empty {<p class="empty catalog-empty">No hay videojuegos ingresados en el catálogo. Agrega uno desde “Catálogo” para verlo aquí.</p>}</div></section>`
})
export class DashboardPageComponent implements OnInit {
  // Servicios que recuperan los datos persistidos por Spring Boot.
  private readonly juegosService = inject(ProductoService);
  private readonly pedidosService = inject(ColeccionService);
  juegos: Videojuego[] = [];
  pedidos: Coleccion[] = [];
  readonly fallbackPortada = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420"%3E%3Crect width="720" height="420" fill="%23101326"/%3E%3Ctext x="50%25" y="50%25" fill="%23eaf7ff" font-family="sans-serif" font-size="42" text-anchor="middle" dominant-baseline="middle"%3EGAMEVAULT%3C/text%3E%3C/svg%3E';

  // Carga el catálogo y los pedidos al abrir Inicio.
  ngOnInit(): void {
    this.juegosService.listar().subscribe({ next: juegos => this.juegos = juegos, error: () => this.juegos = [] });
    this.pedidosService.listar().subscribe({ next: pedidos => this.pedidos = pedidos, error: () => this.pedidos = [] });
  }

  // Contadores derivados para los indicadores superiores.
  get confirmados(): number { return this.pedidos.filter(pedido => pedido.estado === 'CONFIRMADO').length; }
  get cancelados(): number { return this.pedidos.filter(pedido => pedido.estado === 'CANCELADO').length; }

  nombreFormato(formato?: string): string {
    return formato === 'FISICO' ? 'Físico' : formato === 'AMBOS' ? 'Digital + Físico' : 'Digital';
  }

  descripcionJuego(juego: Videojuego): string {
    if (juego.descripcion) return juego.descripcion;
    const descripciones: Record<string, string> = {
      'The Witcher 3: Wild Hunt': 'Acompaña a Geralt en una aventura épica para encontrar a Ciri.',
      'Elden Ring': 'Explora las Tierras Intermedias y derrota jefes legendarios.',
      'Cyberpunk 2077': 'Vive una aventura de rol en Night City como el mercenario V.',
      Hades: 'Escapa del inframundo griego en combates rápidos y llenos de acción.',
      'Hollow Knight': 'Adéntrate en un reino subterráneo lleno de secretos y desafíos.',
      'Stardew Valley': 'Construye tu granja y crea una nueva vida en un tranquilo valle.',
      'Red Dead Redemption 2': 'Vive el ocaso del viejo oeste junto a Arthur Morgan.',
      'Baldurs Gate 3': 'Decide el destino de los Reinos Olvidados en un RPG por turnos.',
      'Portal 2': 'Resuelve acertijos usando portales, física y mucha creatividad.',
      Celeste: 'Ayuda a Madeline a escalar la montaña Celeste.'
    };
    return descripciones[juego.titulo] || 'Una aventura lista para descubrir.';
  }

  imagenAlternativa(evento: Event): void {
    const imagen = evento.target as HTMLImageElement;
    if (imagen.src !== this.fallbackPortada) imagen.src = this.fallbackPortada;
  }
}
