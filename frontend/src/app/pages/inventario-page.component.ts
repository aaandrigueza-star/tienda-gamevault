// Administración del catálogo: formulario y lista para crear, editar o eliminar videojuegos.
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Videojuego } from '../models/videojuego';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-inventario-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="two-columns order-section">

    <!-- FORMULARIO -->
    <form class="panel form-panel" (ngSubmit)="guardar()">
      <p class="eyebrow">ADMINISTRACIÓN DE TIENDA</p>
      <h2>{{ editando ? 'Editar videojuego' : 'Agregar videojuego' }}</h2>

      <label>Título
        <input name="titulo" [(ngModel)]="form.titulo" required>
      </label>

      <label>Género
        <input name="genero" [(ngModel)]="form.genero" required>
      </label>

      <label>Plataforma
        <input name="plataforma" [(ngModel)]="form.plataforma" required>
      </label>

      <label>Precio
        <input name="precio" type="number" step="0.01" [(ngModel)]="form.precio" required>
      </label>

      <label>Año de lanzamiento
        <input name="anio" type="number" [(ngModel)]="form.anioLanzamiento">
      </label>

      <label>URL de portada
        <input name="portada" [(ngModel)]="form.portadaUrl">
      </label>

      <div class="form-actions">
        <button class="primary" type="submit">
          {{ editando ? 'Guardar cambios' : 'Publicar en tienda' }}
        </button>
        @if (editando) {
          <button type="button" (click)="cancelar()">Cancelar</button>
        }
      </div>
    </form>

    <!-- LISTA DE JUEGOS -->
    <div class="panel">
      <p class="eyebrow">CATÁLOGO DE LA TIENDA</p>
      <h2>Videojuegos disponibles</h2>

      <div class="product-list">
        @for (juego of juegos; track juego.id) {
          <article class="product-row">
            <img class="game-thumb"
                 [src]="juego.portadaUrl || 'https://placehold.co/96x64/FFFFFF?text=GAME'"
                 [alt]="juego.titulo">
            <div>
              <strong>{{ juego.titulo }}</strong>
              <span>{{ juego.genero }} · {{ juego.plataforma }} · {{ juego.anioLanzamiento || 'Sin año' }} · \${{ juego.precio }}</span>
            </div>
            <div class="row-actions">
              <button type="button" (click)="editar(juego)">Editar</button>
              <button type="button" class="danger" (click)="eliminar(juego)">Eliminar</button>
            </div>
          </article>
        } @empty {
          <p class="empty">No hay videojuegos publicados.</p>
        }
      </div>
    </div>

  </section>

  @if (mensaje) {
    <p class="message" [class.error]="error">{{ mensaje }}</p>
  }
  `
})
export class InventarioPageComponent implements OnInit {

  private service = inject(ProductoService);

  juegos: Videojuego[] = [];
  form: Videojuego = this.vacio();
  editando?: number;
  mensaje = '';
  error = false;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.listar().subscribe({
      next: x => this.juegos = x,
      error: () => this.aviso('No fue posible conectar con el backend.', true)
    });
  }

  guardar() {
    // Validación mínima antes de enviar
    if (!this.form.titulo || !this.form.genero || !this.form.plataforma || this.form.precio == null) {
      this.aviso('Completa todos los campos obligatorios (incluido precio).', true);
      return;
    }

    const call = this.editando
      ? this.service.actualizar(this.editando, this.form)
      : this.service.crear(this.form);

    call.subscribe({
      next: () => {
        this.aviso(this.editando ? 'Videojuego actualizado.' : 'Videojuego publicado en la tienda.');
        this.cancelar();
        this.cargar();
      },
      error: (e) => {
        console.error('Error al guardar videojuego:', e);
        this.aviso(e.error?.message || e.message || 'Revisa los datos requeridos.', true);
      }
    });
  }

  editar(j: Videojuego) {
    this.editando = j.id;
    this.form = { ...j };
  }

  cancelar() {
    this.editando = undefined;
    this.form = this.vacio();
  }

  eliminar(j: Videojuego) {
    if (j.id && confirm(`¿Eliminar ${j.titulo}?`)) {
      this.service.eliminar(j.id).subscribe({
        next: () => {
          this.aviso('Videojuego eliminado.');
          this.cargar();
        },
        error: () => this.aviso('No se pudo eliminar.', true)
      });
    }
  }

  // 🔥 AQUÍ ESTABA EL PROBLEMA: faltaba "precio"
  private vacio(): Videojuego {
    return {
      titulo: '',
      genero: '',
      plataforma: '',
      precio: 0,               // ← AGREGADO
      anioLanzamiento: undefined,
      portadaUrl: ''
    };
  }

  private aviso(m: string, e = false) {
    this.mensaje = m;
    this.error = e;
  }
}