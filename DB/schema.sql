-----Creo las tablas para las entidades-----
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(25) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    PRIMARY KEY (id_usuario)
);

CREATE TABLE IF NOT EXISTS administrador ( 
    id_administrador INTEGER,

    PRIMARY KEY (id_administrador),
    FOREIGN KEY (id_administrador) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mozo (
    id_mozo INTEGER,

    PRIMARY KEY (id_mozo),
    FOREIGN KEY (id_mozo) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cocinero (
    id_cocinero INTEGER,

    PRIMARY KEY (id_cocinero),
    FOREIGN KEY (id_cocinero) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mesa (
    numero_mesa INTEGER GENERATED ALWAYS AS IDENTITY,
    capacidad INTEGER NOT NULL,
    sector varchar(15) NOT NULL,
    estado_mesa VARCHAR(15) NOT NULL,

    PRIMARY KEY (numero_mesa)
);

CREATE TABLE IF NOT EXISTS comanda (
    numero_comanda INTEGER GENERATED ALWAYS AS IDENTITY,
    fecha TIMESTAMP DEFAULT NOW(),
    estado_comanda VARCHAR(15) NOT NULL,
    numero_mesa INTEGER,

    PRIMARY KEY (numero_comanda),
    FOREIGN KEY (numero_mesa) REFERENCES mesa(numero_mesa)
);

CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(15) NOT NULL,

    PRIMARY KEY (id_categoria)
);

CREATE TABLE IF NOT EXISTS plato (
    id_plato INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(25) NOT NULL,
    precio NUMERIC(7, 2) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    id_categoria INTEGER NOT NULL,

    PRIMARY KEY (id_plato),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE IF NOT EXISTS ingrediente (
    id_ingrediente INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(25) NOT NULL,
    stock INTEGER NOT NULL,
    stock_minimo INTEGER NOT NULL,
    unidad VARCHAR(5) NOT NULL,

    PRIMARY KEY (id_ingrediente)
);

CREATE TABLE IF NOT EXISTS mov_stock (
    id_mov INTEGER GENERATED ALWAYS AS IDENTITY,
    fecha TIMESTAMP DEFAULT NOW(),
    cantidad INTEGER NOT NULL,
    id_ingrediente INTEGER NOT NULL,
    id_administrador INTEGER NOT NULL,

    PRIMARY KEY (id_mov, id_administrador),
    FOREIGN KEY (id_ingrediente) REFERENCES ingrediente(id_ingrediente),
    FOREIGN KEY (id_administrador) REFERENCES administrador(id_administrador)
);

-----Creo las tablas para las entidades debiles-----
CREATE TABLE IF NOT EXISTS item_pedido (
    cantidad INTEGER NOT NULL,
    notas TEXT NOT NULL,
    estado_item VARCHAR(15) NOT NULL,
    numero_comanda INTEGER NOT NULL,
    id_plato INTEGER NOT NULL,
    
    PRIMARY KEY (id_plato, numero_comanda),
    FOREIGN KEY (id_plato) REFERENCES plato(id_plato),
    FOREIGN KEY (numero_comanda) REFERENCES comanda(numero_comanda) ON DELETE CASCADE
);

-----Creo las tablas para las relaciones-----
CREATE TABLE IF NOT EXISTS mozo_comanda (
    id_mozo INTEGER NOT NULL,
    numero_comanda INTEGER NOT NULL,
    
    PRIMARY KEY (id_mozo, numero_comanda),
    FOREIGN KEY (id_mozo) REFERENCES mozo(id_mozo) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (numero_comanda) REFERENCES comanda(numero_comanda) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS receta (
    id_plato INTEGER NOT NULL,
    id_ingrediente INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,

    PRIMARY KEY (id_plato, id_ingrediente),
    FOREIGN KEY (id_plato) REFERENCES plato(id_plato) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_ingrediente) REFERENCES ingrediente(id_ingrediente) ON DELETE CASCADE
);