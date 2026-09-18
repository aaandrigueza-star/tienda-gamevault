// Administración del catálogo: formulario y lista para crear, editar o eliminar videojuegos.
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaProducto, Videojuego } from '../models/videojuego';
import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="two-columns order-section" [class.catalog-only]="!soloIngreso" [class.product-entry]="soloIngreso">

    <!-- FORMULARIO -->
    @if (soloIngreso) {
    <form class="panel form-panel" (ngSubmit)="guardar()">
      <p class="eyebrow">INGRESO DE PRODUCTOS</p>
      <h2>{{ editando ? 'Editar producto' : 'Ingresar producto' }}</h2>

      <label>Categoría
        <select name="categoria" [(ngModel)]="form.categoria">
          <option value="VIDEOJUEGOS">Videojuegos</option>
          <option value="CONSOLAS">Consolas</option>
          <option value="CONTROLES">Controles</option>
          <option value="REPUESTOS_CONSOLAS">Repuestos para consolas</option>
          <option value="COMPUTADORES">Computadores gaming / alta gama</option>
          <option value="REPUESTOS_COMPUTADORES">Repuestos de computador</option>
        </select>
      </label>

      <label>Título
        <input name="titulo" [(ngModel)]="form.titulo" required>
      </label>

      <label>Género
        <input name="genero" [(ngModel)]="form.genero" required>
      </label>

      <label>Descripción breve
        <textarea name="descripcion" rows="3" [(ngModel)]="form.descripcion" placeholder="¿De qué trata este juego?"></textarea>
      </label>

      <label>Formato
        <select name="formato" [(ngModel)]="form.formato">
          <option value="DIGITAL">Digital</option>
          <option value="FISICO">Físico</option>
          <option value="AMBOS">Digital + Físico</option>
        </select>
      </label>

      <label>Tipo de consola
        <input name="plataforma" [(ngModel)]="form.plataforma" required placeholder="Multiplataforma">
      </label>

      <div class="stock-fields">
        <label>Xbox · unidades
          <input name="xboxUnidades" type="number" min="0" step="1" [(ngModel)]="form.xboxUnidades">
        </label>
        <label>PlayStation · unidades
          <input name="playstationUnidades" type="number" min="0" step="1" [(ngModel)]="form.playstationUnidades">
        </label>
        <label>Nintendo · unidades
          <input name="nintendoUnidades" type="number" min="0" step="1" [(ngModel)]="form.nintendoUnidades">
        </label>
      </div>

      <label class="platform-note">Puedes registrar unidades para una, dos o las tres consolas.
      </label>

      <label>Precio
        <input name="precio" type="number" step="0.01" [(ngModel)]="form.precio" required>
      </label>

      <label>Año de lanzamiento
        <input name="anio" type="number" [(ngModel)]="form.anioLanzamiento">
      </label>

      <label>URL o imagen Base64 de portada
        <textarea name="portada" rows="4" [(ngModel)]="form.portadaUrl" placeholder="https://... o data:image/jpeg;base64,..."></textarea>
      </label>

      <div class="form-actions">
        <button class="primary" type="submit">
          {{ editando ? 'Guardar cambios' : 'Ingresar producto' }}
        </button>
        @if (editando) {
          <button type="button" (click)="cancelar()">Cancelar</button>
        }
      </div>
    </form>
    }

    <!-- LISTA DE JUEGOS -->
    <div class="panel">
      <p class="eyebrow">PRODUCTOS REGISTRADOS</p>
      <label class="catalog-search">Buscar producto
        <input name="busqueda" [(ngModel)]="busqueda" type="search" placeholder="Nombre, categoría, consola o descripción...">
      </label>
      <label class="catalog-filter">Filtrar productos por categoría
        <select name="filtroCategoria" [(ngModel)]="filtroCategoria">
          <option value="TODAS">Todas las categorías</option>
          <option value="VIDEOJUEGOS">Videojuegos</option>
          <option value="CONSOLAS">Consolas</option>
          <option value="CONTROLES">Controles</option>
          <option value="REPUESTOS_CONSOLAS">Repuestos para consolas</option>
          <option value="COMPUTADORES">Computadores gaming / alta gama</option>
          <option value="REPUESTOS_COMPUTADORES">Repuestos de computador</option>
        </select>
      </label>
      <h2>{{ nombreCategoria(filtroCategoria) }}</h2>

      <div class="product-list">
        @for (juego of juegosFiltrados; track juego.id) {
          <article class="product-row">
            <img class="game-thumb"
                [src]="juego.portadaUrl || fallbackPortada"
                [alt]="juego.titulo"
                (error)="imagenAlternativa($event)">
            <div>
              <strong>{{ juego.titulo }}</strong>
                <small class="category-label">{{ nombreCategoria(juego.categoria) }}</small>
                <small class="game-description">{{ descripcionJuego(juego) }}</small>
                <span>{{ juego.genero }} · {{ nombreFormato(juego.formato) }} · {{ juego.anioLanzamiento || 'Sin año' }} · \${{ juego.precio }}</span>
                <small class="stock-summary">Xbox: {{ juego.xboxUnidades || 0 }} · PlayStation: {{ juego.playstationUnidades || 0 }} · Nintendo: {{ juego.nintendoUnidades || 0 }}</small>
            </div>
            @if (soloIngreso) {
              <div class="row-actions">
                <button type="button" (click)="editar(juego)">Editar</button>
                <button type="button" class="danger" (click)="eliminar(juego)">Eliminar</button>
              </div>
            }
          </article>
        } @empty {
          <p class="empty">No hay productos registrados en esta categoría.</p>
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

  private readonly router = inject(Router);
  readonly soloIngreso = this.router.url.includes('/ingresar-producto');

  private service = inject(ProductoService);

  juegos: Videojuego[] = [];
  filtroCategoria: CategoriaProducto | 'TODAS' = 'TODAS';
  busqueda = '';
  readonly fallbackPortada = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 64"%3E%3Crect width="96" height="64" fill="%23101326"/%3E%3Ctext x="50%25" y="50%25" fill="%23eaf7ff" font-family="sans-serif" font-size="10" text-anchor="middle" dominant-baseline="middle"%3EGAMEVAULT%3C/text%3E%3C/svg%3E';
  form: Videojuego = this.vacio();
  editando?: number;
  mensaje = '';
  error = false;

  get juegosFiltrados(): Videojuego[] {
    const texto = this.busqueda.trim().toLowerCase();
    const resultados = this.juegos.filter(juego => {
      const coincideCategoria = this.filtroCategoria === 'TODAS'
        || this.normalizarCategoria(juego.categoria) === this.filtroCategoria;
      const contenido = [juego.titulo, juego.categoria, juego.genero, juego.plataforma, juego.descripcion]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return coincideCategoria && (!texto || contenido.includes(texto));
    });
    return this.ordenar(resultados);
  }

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

    this.form.portadaUrl = this.form.portadaUrl?.trim();
    if (this.form.portadaUrl && !this.form.portadaUrl.startsWith('data:image/')
      && !this.form.portadaUrl.startsWith('http://')
      && !this.form.portadaUrl.startsWith('https://')
      && !this.form.portadaUrl.startsWith('/assets/')) {
      this.aviso('La portada debe comenzar con data:image/, http://, https:// o /assets/.', true);
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
    this.form = {
      ...j,
      categoria: j.categoria || 'VIDEOJUEGOS',
      formato: j.formato || 'DIGITAL',
      descripcion: j.descripcion || '',
      xboxUnidades: j.xboxUnidades || 0,
      playstationUnidades: j.playstationUnidades || 0,
      nintendoUnidades: j.nintendoUnidades || 0
    };
  }

  cancelar() {
    this.editando = undefined;
    this.form = this.vacio();
  }

  imagenAlternativa(evento: Event): void {
    const imagen = evento.target as HTMLImageElement;
    if (imagen.src !== this.fallbackPortada) imagen.src = this.fallbackPortada;
  }

  nombreFormato(formato?: string): string {
    return formato === 'FISICO' ? 'Físico' : formato === 'AMBOS' ? 'Digital + Físico' : 'Digital';
  }

  nombreCategoria(categoria?: string): string {
    const nombres: Record<string, string> = { TODAS: 'Catálogo completo', VIDEOJUEGOS: 'Videojuegos', CONSOLAS: 'Consolas', CONTROLES: 'Controles', REPUESTOS_CONSOLAS: 'Repuestos para consolas', COMPUTADORES: 'Computadores gaming / alta gama', REPUESTOS_COMPUTADORES: 'Repuestos de computador' };
    return nombres[categoria || 'TODAS'] || 'Catálogo';
  }

  private normalizarCategoria(categoria?: string): string {
    return (categoria || 'VIDEOJUEGOS').trim().toUpperCase();
  }

  private ordenar(juegos: Videojuego[]): Videojuego[] {
    return [...juegos].sort((a, b) => {
      const categoria = this.normalizarCategoria(a.categoria).localeCompare(this.normalizarCategoria(b.categoria));
      return categoria || a.titulo.localeCompare(b.titulo);
    });
  }

  descripcionJuego(juego: Videojuego): string {
    return juego.descripcion || 'Añade una descripción breve al editar este juego.';
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
      descripcion: '',
      categoria: 'VIDEOJUEGOS',
      plataforma: '',
      formato: 'DIGITAL',
      xboxUnidades: 0,
      playstationUnidades: 0,
      nintendoUnidades: 0,
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