// Servicio HTTP del catálogo: centraliza las llamadas CRUD al backend.
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego } from '../models/videojuego';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/videojuegos';

  listar(): Observable<Videojuego[]> { return this.http.get<Videojuego[]>(this.apiUrl); }
  crear(juego: Videojuego): Observable<Videojuego> { return this.http.post<Videojuego>(this.apiUrl, juego); }
  actualizar(id: number, juego: Videojuego): Observable<Videojuego> { return this.http.put<Videojuego>(`${this.apiUrl}/${id}`, juego); }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
