// Historial de pedidos: muestra cada pedido con su cliente, correo, juegos y total.
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Coleccion } from '../models/coleccion';
import { ColeccionService } from '../services/coleccion.service';

@Component({
  selector: 'app-pedidos-page',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="panel">
    <p class="eyebrow">RECURSO 2: PEDIDOS</p>
    <h2>Pedidos de la tienda</h2>

    <div class="order-list">
      @for (item of coleccion; track item.id) {
        <article class="order-row">
          <div>
            <strong>
              @for (d of item.detalles; track d.videojuegoId) {
                <span>{{ d.titulo }} (x{{ d.cantidad }}){{ $last ? '' : ', ' }}</span>
              } @empty {
                <span>Sin juegos</span>
              }
            </strong>
            <span>
              Cliente: {{ item.jugador }} · Correo: {{ item.correo }} · {{ item.plataforma }}
            </span>
            <span><strong>Total:</strong> \${{ item.total }}</span>
          </div>

          <span class="status"
                [class.pendiente]="item.estado==='PENDIENTE'"
                [class.confirmado]="item.estado==='CONFIRMADO'"
                [class.cancelado]="item.estado==='CANCELADO'">
            {{ item.estado }}
          </span>

          <div class="row-actions">
            <button type="button" class="danger" (click)="eliminar(item)">Eliminar</button>
          </div>
        </article>
      } @empty {
        <p class="empty">Todavía no hay pedidos registrados.</p>
      }
    </div>
  </section>

  @if (mensaje) {
    <p class="message" [class.error]="error">{{ mensaje }}</p>
  }
  `
})
export class PedidosPageComponent implements OnInit {

  private items = inject(ColeccionService);

  coleccion: Coleccion[] = [];
  mensaje = '';
  error = false;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.items.listar().subscribe({
      next: x => this.coleccion = x,
      error: () => this.nota('No se pudo cargar los pedidos.', true)
    });
  }

  eliminar(i: Coleccion) {
    if (i.id && confirm('¿Eliminar este pedido?')) {
      this.items.eliminar(i.id).subscribe({
        next: () => {
          this.nota('Pedido eliminado.');
          this.cargar();
        },
        error: () => this.nota('No se pudo eliminar.', true)
      });
    }
  }

  private nota(m: string, e = false) {
    this.mensaje = m;
    this.error = e;
  }
}