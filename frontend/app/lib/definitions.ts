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
  sector: string;
  estadoMesa: EstadoMesa;
  horaDeApertura: string | null;
};

export type Comanda = {
  numeroComanda: number;
  estadoComanda: EstadoComanda;
  fecha: string;
  mesa: Mesa;
  mozos: Usuario[];
};

export type Categoria = {
  idCategoria: number;
  nombre: Category;
};

export type Plato = {
  idPlato: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: Categoria;
};

export type Receta = {
  cant: number;
  plato: Plato;
  idIngrediente: number;
};

export type Item_Pedido = {
  id: number;
  cant: number;
  notas: string;
  estado: EstadoItem;
  nComanda: number;
  plato: Plato;
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
  fecha: string;
  cantidad: number;
  ingrediente: Ingrediente;
  usuario: Usuario;
};
