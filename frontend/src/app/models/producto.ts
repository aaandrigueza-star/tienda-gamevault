// Interfaz heredada del ejercicio inicial; el catálogo de la tienda usa Videojuego.
export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  cantidad: number;
  categoria: string;
}
