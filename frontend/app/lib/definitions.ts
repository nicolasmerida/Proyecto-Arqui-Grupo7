// app/lib/definitions.ts
export enum Rol {
  Administrador = "Administrador",
  Cocinero = "Cocinero",
  Mozo = "Mozo"
};

export enum EstadoUsuario {
  Activo = "activo",
  Suspendido = "Suspendido"
};

export enum EstadoMesa {
  Libre = "libre",
  Ocupada = "ocupada"
};

export enum EstadoComanda {
  Pendiente = "pendiente",
  Preparacion = "en preparacion",
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

export enum Category {
  Entrada = "entrada",
  Principal = "principal",
  Postre = "postre",
  Bebida = "bebida"
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