export interface Videojuego {
  id?: number;
  titulo: string;
  genero: string;
  descripcion?: string;
  categoria?: CategoriaProducto;
  plataforma: string;
  formato?: 'DIGITAL' | 'FISICO' | 'AMBOS';
  xboxUnidades?: number;
  playstationUnidades?: number;
  nintendoUnidades?: number;
  precio: number;
  anioLanzamiento?: number;
  portadaUrl?: string;
}

export type CategoriaProducto = 'VIDEOJUEGOS' | 'CONSOLAS' | 'CONTROLES' | 'REPUESTOS_CONSOLAS' | 'COMPUTADORES' | 'REPUESTOS_COMPUTADORES';