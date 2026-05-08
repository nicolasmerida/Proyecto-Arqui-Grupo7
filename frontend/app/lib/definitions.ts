// app/lib/definitions.ts
export enum Roles {
  Administrador = "Administrador",
  Cocinero = "Cocinero",
  Mozo = "Mozo"
};

export enum EstadoMesa {
  Libre = "libre",
  Ocupada = "ocupada"
};

export enum EstadoComanda {
  Pendiente = "pendiente",
  Prepracion = "en preparacion",
  Lista = "lista",
  Entregada = "entregada",
  Cerrada = "cerrada",
  Cancelada = "cancelada"
};

export enum EstadoItem {
  Pendiente = "pendiente",
  Preparacion = "en preparacion",
  Listo = "listo",
  Entregado = "entregado",
  Cancelado = "cancelado"
};

export type Course = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
}