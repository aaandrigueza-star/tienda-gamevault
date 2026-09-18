import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coleccion } from '../models/coleccion';

@Injectable({ providedIn: 'root' })
export class ColeccionService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/colecciones'; // ✅ CORREGIDO

  listar(): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(this.baseUrl);
  }

  crear(coleccion: Coleccion): Observable<Coleccion> {
    return this.http.post<Coleccion>(this.baseUrl, coleccion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}