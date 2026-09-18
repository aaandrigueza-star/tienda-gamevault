export interface Videojuego {
  id?: number;
  titulo: string;
  genero: string;
  plataforma: string;
  precio: number;
  anioLanzamiento?: number;
  portadaUrl?: string;
}