// Servicio de API externa: obtiene videojuegos públicos para publicarlos en la tienda.
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface JuegoExterno { id: number; title: string; genre: string; platform: string; release_date: string; thumbnail: string; }
@Injectable({ providedIn: 'root' })
export class FreeToGameService {
  private readonly http = inject(HttpClient);
  buscar(): Observable<JuegoExterno[]> { return this.http.get<JuegoExterno[]>('https://www.freetogame.com/api/games'); }
}
