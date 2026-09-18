// Página de compra: crea un pedido con varios videojuegos y correo de envío.
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColeccionService } from '../services/coleccion.service';
import { ProductoService } from '../services/producto.service';
import { Videojuego } from '../models/videojuego';

interface DetalleTemporal {
  videojuegoId: number;
  titulo: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-crear-pedido-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="panel form-panel narrow">
    <p class="eyebrow">NUEVO PEDIDO</p>
    <h2>Finalizar compra</h2>

    <form (ngSubmit)="guardar()">
      <label>Nombre del cliente
        <input name="jugador" [(ngModel)]="jugador" required>
      </label>

      <label>Correo electrónico
        <input name="correo" type="email" [(ngModel)]="correo" required>
      </label>

      <label>Estado del pedido
        <select name="estado" [(ngModel)]="estado">
          <option value="PENDIENTE">Pendiente</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </label>

      <label>Formato / plataforma
        <input name="plataforma" [(ngModel)]="plataforma" required>
      </label>

      <hr>

      <p class="eyebrow">AGREGAR JUEGO AL PEDIDO</p>

      <label>Videojuego
        <select name="juego" [(ngModel)]="videojuegoId">
          <option [ngValue]="0" disabled>Selecciona un videojuego</option>
          @for (juego of juegos; track juego.id) {
            <option [ngValue]="juego.id">{{ juego.titulo }} · {{ juego.plataforma }} · \${{ juego.precio }}</option>
          }
        </select>
      </label>

      <label>Cantidad
        <input name="cantidad" type="number" min="1" [(ngModel)]="cantidad">
      </label>

      <button type="button" class="secondary" (click)="agregarJuego()">+ Agregar al pedido</button>

      @if (detalles.length > 0) {
        <table class="detalle-tabla">
          <thead>
            <tr><th>Juego</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th></th></tr>
          </thead>
          <tbody>
            @for (d of detalles; track d.videojuegoId) {
              <tr>
                <td>{{ d.titulo }}</td>
                <td>{{ d.cantidad }}</td>
                <td>\${{ d.precio }}</td>
                <td>\${{ d.precio * d.cantidad }}</td>
                <td><button type="button" class="danger" (click)="quitarJuego(d.videojuegoId)">X</button></td>
              </tr>
            }
          </tbody>
          <tfoot>
            <tr><td colspan="3"><strong>Total</strong></td><td colspan="2"><strong>\${{ total }}</strong></td></tr>
          </tfoot>
        </table>
      } @else {
        <p class="empty">Aún no has agregado juegos al pedido.</p>
      }

      <button class="primary" type="submit">Registrar pedido</button>
    </form>

    @if (mensaje) {
      <p class="message" [class.error]="error">{{ mensaje }}</p>
    }
  </section>
  `
})
export class CrearPedidoPageComponent implements OnInit {

  private juegosService = inject(ProductoService);
  private coleccion = inject(ColeccionService);

  juegos: Videojuego[] = [];

  jugador = '';
  correo = '';
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' = 'PENDIENTE';
  plataforma = 'Digital';

  videojuegoId = 0;
  cantidad = 1;

  detalles: DetalleTemporal[] = [];

  mensaje = '';
  error = false;

  ngOnInit() {
    this.juegosService.listar().subscribe({
      next: x => this.juegos = x,
      error: () => this.notificar('No se cargó el catálogo.', true)
    });
  }

  agregarJuego() {
    if (!this.videojuegoId || this.cantidad <= 0) {
      this.notificar('Selecciona un videojuego y una cantidad válida.', true);
      return;
    }

    const juego = this.juegos.find(j => j.id === Number(this.videojuegoId));
    if (!juego) {
      this.notificar('Videojuego no encontrado.', true);
      return;
    }

    const existente = this.detalles.find(d => d.videojuegoId === juego.id);
    if (existente) {
      existente.cantidad += this.cantidad;
    } else {
      this.detalles.push({
        videojuegoId: juego.id!,
        titulo: juego.titulo,
        precio: juego.precio,
        cantidad: this.cantidad
      });
    }

    this.videojuegoId = 0;
    this.cantidad = 1;
    this.notificar('');
  }

  quitarJuego(id: number) {
    this.detalles = this.detalles.filter(d => d.videojuegoId !== id);
  }

  get total(): number {
    return this.detalles.reduce((sum, d) => sum + d.precio * d.cantidad, 0);
  }

  guardar() {
    if (!this.jugador || !this.correo || this.detalles.length === 0) {
      this.notificar('Completa el nombre, correo y agrega al menos un juego.', true);
      return;
    }

    const payload = {
      jugador: this.jugador,
      correo: this.correo,
      estado: this.estado,
      plataforma: this.plataforma,
      total: this.total,
      detalles: this.detalles.map(d => ({
        videojuegoId: d.videojuegoId,
        cantidad: d.cantidad
      }))
    };

    console.log('Enviando pedido:', payload);

    this.coleccion.crear(payload as any).subscribe({
      next: () => {
        this.notificar('Pedido registrado correctamente.');
        this.jugador = '';
        this.correo = '';
        this.detalles = [];
        this.videojuegoId = 0;
        this.cantidad = 1;
      },
      error: e => {
        console.error('Error al registrar pedido:', e);
        this.notificar(e.error?.message || 'Error al registrar el pedido.', true);
      }
    });
  }

  private notificar(m: string, e = false) {
    this.mensaje = m;
    this.error = e;
  }
}