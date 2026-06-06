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
  Pendiente = "PENDIENTE",
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
  numero: number;
  capacidad: number;
  sector: string;
  estado: EstadoMesa;
  hora_apertura: Date | null;
};

export type Comanda = {
  numero_comanda: number;
  estado: EstadoComanda;
  fecha: Date;
  numero_mesa: number;
  mozo: Usuario;
};

export type Plato = {
  id: number;
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

export type Categoria = {
  id: number;
  nombre: Category;
};

export type Ingrediente = {
  id: number;
  nombre: string;
  stock: number;
  stock_mininmo: number;
  unidad: string;
};

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  contraseña: string;
  rol: Rol;
  estado: EstadoUsuario;
};

export type Mov_Stock = {
  id: number;
  cant: number;
  fecha: Date;
  ingrediente: Ingrediente;
  usuario: Usuario;
};