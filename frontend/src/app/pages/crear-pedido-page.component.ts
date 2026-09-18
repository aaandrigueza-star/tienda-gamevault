// Página de compra: crea un pedido con varios videojuegos y correo de envío.
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColeccionService } from '../services/coleccion.service';
import { ProductoService } from '../services/producto.service';
import { CategoriaProducto, Videojuego } from '../models/videojuego';

interface DetalleTemporal {
  videojuegoId: number;
  titulo: string;
  precio: number;
  cantidad: number;
  formato: 'DIGITAL' | 'FISICO' | 'AMBOS';
  consola: string;
}

@Component({
  selector: 'app-crear-pedido-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="panel form-panel narrow purchase-panel">
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

      <hr>

      <p class="eyebrow">AÑADIR PRODUCTOS AL PEDIDO</p>

      <label>Tipo de producto
        <select name="categoriaCompra" [(ngModel)]="categoriaCompra">
          <option value="TODAS">Todos los productos</option>
          <option value="VIDEOJUEGOS">Videojuegos</option>
          <option value="CONSOLAS">Consolas</option>
          <option value="CONTROLES">Controles</option>
          <option value="REPUESTOS_CONSOLAS">Repuestos para consolas</option>
          <option value="COMPUTADORES">Computadores gaming / alta gama</option>
          <option value="REPUESTOS_COMPUTADORES">Repuestos de computador</option>
        </select>
      </label>

      <label>Buscar producto
        <input name="busquedaCompra" type="search" [(ngModel)]="busquedaCompra" placeholder="Busca por nombre, categoría o consola...">
      </label>

      <label>Producto para añadir
        <select name="juego" [(ngModel)]="videojuegoId">
          <option [ngValue]="0" disabled>Selecciona un producto</option>
          @for (juego of productosDisponibles; track juego.id) {
            <option [ngValue]="juego.id">{{ juego.titulo }} · {{ nombreFormato(juego.formato) }} · Xbox {{ juego.xboxUnidades || 0 }} / PS {{ juego.playstationUnidades || 0 }} / Nintendo {{ juego.nintendoUnidades || 0 }} · \${{ juego.precio }}</option>
          }
        </select>
      </label>

      @if (productosDisponibles.length === 0) {
        <p class="empty">No hay productos que coincidan con la búsqueda.</p>
      }

      <label>Formato
        <select name="formatoCompra" [(ngModel)]="formatoCompra">
          <option value="DIGITAL">Digital</option>
          <option value="FISICO">Físico</option>
          <option value="AMBOS">Digital + Físico</option>
        </select>
      </label>

      <label>Tipo de consola
        <select name="consolaCompra" [(ngModel)]="consolaCompra">
          <option value="XBOX">Xbox</option>
          <option value="PLAYSTATION">PlayStation</option>
          <option value="NINTENDO">Nintendo</option>
          <option value="MULTIPLATAFORMA">Multiplataforma</option>
        </select>
      </label>

      @if (juegoSeleccionado) {
        <p class="stock-summary">Disponibles: {{ unidadesDisponibles(juegoSeleccionado) }} unidades</p>
      }

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
                <td>{{ d.titulo }}<small class="game-description">{{ nombreFormato(d.formato) }} · {{ d.consola }}</small></td>
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
  formatoCompra: 'DIGITAL' | 'FISICO' | 'AMBOS' = 'DIGITAL';
  consolaCompra = 'MULTIPLATAFORMA';
  plataforma = 'Multiplataforma';
  categoriaCompra: CategoriaProducto | 'TODAS' = 'TODAS';
  busquedaCompra = '';

  videojuegoId = 0;
  cantidad = 1;

  detalles: DetalleTemporal[] = [];

  mensaje = '';
  error = false;

  get juegoSeleccionado(): Videojuego | undefined { return this.juegos.find(juego => juego.id === Number(this.videojuegoId)); }

  get productosDisponibles(): Videojuego[] {
    const texto = this.busquedaCompra.trim().toLowerCase();
    return this.juegos
      .filter(juego => {
        const categoria = (juego.categoria || 'VIDEOJUEGOS').trim().toUpperCase();
        const contenido = [juego.titulo, juego.categoria, juego.genero, juego.plataforma, juego.descripcion]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return (this.categoriaCompra === 'TODAS' || categoria === this.categoriaCompra)
          && (!texto || contenido.includes(texto));
      })
      .sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  ngOnInit() {
    this.juegosService.listar().subscribe({
      next: x => this.juegos = x,
      error: () => this.notificar('No se cargó el catálogo.', true)
    });
  }

  agregarJuego() {
    if (!this.videojuegoId || this.cantidad <= 0 || !this.juegoSeleccionado) {
      this.notificar('Selecciona un videojuego y una cantidad válida.', true);
      return;
    }

    const juego = this.juegoSeleccionado;
    if (!juego) return;
    const disponibles = this.unidadesDisponibles(juego);
    if (disponibles > 0 && this.cantidad > disponibles) { this.notificar(`Solo hay ${disponibles} unidades disponibles.`, true); return; }

    const existente = this.detalles.find(d => d.videojuegoId === juego.id);
    if (existente) {
      existente.cantidad += this.cantidad;
    } else {
      this.detalles.push({
        videojuegoId: juego.id!,
        titulo: juego.titulo,
        precio: juego.precio,
        cantidad: this.cantidad,
        formato: this.formatoCompra,
        consola: this.consolaCompra
      });
    }

    this.videojuegoId = 0;
    this.cantidad = 1;
    this.formatoCompra = 'DIGITAL';
    this.consolaCompra = 'MULTIPLATAFORMA';
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
        cantidad: d.cantidad,
        formato: d.formato,
        consola: d.consola
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

  nombreFormato(formato?: string): string {
    return formato === 'FISICO' ? 'Físico' : formato === 'AMBOS' ? 'Digital + Físico' : 'Digital';
  }

  unidadesDisponibles(juego: Videojuego): number {
    if (this.consolaCompra === 'XBOX') return juego.xboxUnidades || 0;
    if (this.consolaCompra === 'PLAYSTATION') return juego.playstationUnidades || 0;
    if (this.consolaCompra === 'NINTENDO') return juego.nintendoUnidades || 0;
    return (juego.xboxUnidades || 0) + (juego.playstationUnidades || 0) + (juego.nintendoUnidades || 0);
  }
}