export interface DetallePedido {
  videojuegoId: number;
  titulo?: string;
  precioUnitario?: number;
  cantidad: number;
  subtotal?: number;
}

export interface Coleccion {
  id?: number;
  jugador: string;
  correo: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';
  plataforma: string;
  total?: number;
  detalles: DetallePedido[];
}