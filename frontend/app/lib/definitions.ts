// app/lib/definitions.ts
export enum Rol {
  Administrador = "ADMINISTRADOR",
  Cocinero = "COCINERO",
  Mozo = "MOZO"
};

export enum EstadoUsuario {
  Activo = "ACTIVO",
  Suspendido = "SUSPENDIDO"
};

export enum EstadoMesa {
  Libre = "LIBRE",
  Ocupada = "OCUPADA"
};

export enum EstadoComanda {
  Abierta = "ABIERTA",
  Preparacion = "EN_PREPARACION",
  Lista = "LISTA",
  Entregada = "ENTREGADA",
  Cerrada = "CERRADA",
  Cancelada = "CANCELADA"
};

export enum EstadoItem {
  Pendiente = "PENDIENTE",
  Preparacion = "EN_PREPARACION",
  Listo = "LISTO",
  Entregado = "ENTREGADO",
  Cerrado = "CERRADO",
  Cancelado = "CANCELADO"
};

export enum Category {
  Entrada = "ENTRADA",
  Principal = "PRINCIPAL",
  Postre = "POSTRE",
  Bebida = "BEBIDA"
}

export type Mesa = {
  numeroMesa: number;
  capacidad: number;
  estadoMesa: EstadoMesa;
  horaApertura: string | null;
};

export type ComandaResumen = {
  numeroComanda: number;
  estadoComanda: EstadoComanda;
  fecha: string;
  mesa: Mesa;
};

export type ComandaDetalle = {
  numeroComanda: number;
  estadoComanda: EstadoComanda;
  fecha: string;
  mesa: Mesa;
  items: Item_Pedido[];
};

export type Plato = {
  idPlato: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: Categoria;
  activo: boolean;
};

export type Receta = {
  cantidad: number;
  plato?: Plato;
  ingrediente: Ingrediente;
};

export type Item_Pedido = {
  numeroComanda: number;
  idPlato: number;
  nombrePlato: string;
  cantidad: number;
  notas: string;
  estadoItem: EstadoItem;
  precio?: number; // Usado solo en el frontend para el carrito
};

export type Categoria = {
  idCategoria: number;
  nombre: Category;
};

export type Ingrediente = {
  idIngrediente: number;
  nombre: string;
  stock: number;
  stockMinimo: number;
  unidad: string;
};

export type Usuario = {
  idUsuario: number;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  estado?: EstadoUsuario;
};

export type Mov_Stock = {
  idMov: number;
  cantidad: number;
  fecha: string;
  ingrediente: Ingrediente;
  usuario: Usuario;
};