# Correcciones Frontend ↔ Backend — Sincronización de tipos y datos

**Fecha:** 08/06/2026  
**Rama:** `main`  
**Commit base:** `1bf5322`

---

## Contexto general del problema

El frontend y el backend nunca habían conectado datos reales de forma exitosa. Había **dos categorías de problemas**:

1. **Crashes reales** — páginas que rompían al recibir datos del backend porque los nombres de campos en el JSON no coincidían con lo que el frontend esperaba.
2. **Datos que nunca cargaban** — tablas del admin que siempre aparecían vacías porque les faltaba el `useEffect` para llamar al backend.

---

## 1. Frontend — `app/lib/definitions.ts`

### El problema
Los tipos TypeScript del frontend usaban nombres de campos inventados que **no coincidían con los nombres que Jackson/Spring serializa** desde los modelos Java.

Jackson serializa los campos Java con su nombre camelCase exacto. Por ejemplo, el campo Java `private Integer idIngrediente` se convierte en `"idIngrediente"` en el JSON — no en `"id"`.

### Cambios realizados

#### `EstadoComanda` — valor incorrecto
```typescript
// ANTES ❌
export enum EstadoComanda {
  Pendiente = "PENDIENTE",   // Este valor no existe en el backend
  ...
}

// DESPUÉS ✓
export enum EstadoComanda {
  Abierta = "ABIERTA",       // Coincide con EstadoComanda.ABIERTA del backend
  ...
}
```

#### `Comanda` — todos los campos estaban mal
```typescript
// ANTES ❌ — el backend NUNCA devuelve estos campos con estos nombres
export type Comanda = {
  numero_comanda: number;   // backend: "numeroComanda"
  estado: EstadoComanda;    // backend: "estadoComanda"
  fecha: Date;              // backend: string ISO (JSON no tiene tipo Date)
  numero_mesa: number;      // backend: "mesa" (objeto completo, no número)
  mozo: Usuario;            // backend: "mozos" (array, no objeto único)
};

// DESPUÉS ✓ — refleja exactamente lo que devuelve el backend
export type Comanda = {
  numeroComanda: number;
  estadoComanda: EstadoComanda;
  fecha: string;
  mesa: Mesa;
  mozos: Usuario[];
};
```

#### `Mesa` — campos con nombres distintos
```typescript
// ANTES ❌
export type Mesa = {
  numero: number;             // backend: "numeroMesa"
  estado: EstadoMesa;         // backend: "estadoMesa"
  hora_apertura: Date | null; // backend: "horaDeApertura" y es string
};

// DESPUÉS ✓
export type Mesa = {
  numeroMesa: number;
  estadoMesa: EstadoMesa;
  horaDeApertura: string | null;
};
```

#### `Ingrediente` — `id` mal y typo en `stock_mininmo`
```typescript
// ANTES ❌
export type Ingrediente = {
  id: number;            // backend: "idIngrediente"
  stock_mininmo: number; // typo + nombre incorrecto; backend: "stockMinimo"
};

// DESPUÉS ✓
export type Ingrediente = {
  idIngrediente: number;
  stockMinimo: number;
};
```

#### `Usuario` — varios campos incorrectos
```typescript
// ANTES ❌
export type Usuario = {
  id: number;          // backend: "idUsuario"
  contraseña: string;  // backend: "password"
  estado: EstadoUsuario; // el backend NO tiene este campo todavía
};

// DESPUÉS ✓
export type Usuario = {
  idUsuario: number;
  password: string;
  estado?: EstadoUsuario; // opcional — no implementado aún en backend
};
```

#### `Mov_Stock` — tres campos incorrectos
```typescript
// ANTES ❌
export type Mov_Stock = {
  id: number;    // backend: "idMov"
  fecha: Date;   // backend: string ISO
  cant: number;  // backend: "cantidad"
};

// DESPUÉS ✓
export type Mov_Stock = {
  idMov: number;
  fecha: string;
  cantidad: number;
};
```

#### `Plato` y `Categoria` — IDs con nombre distinto
```typescript
// ANTES ❌
export type Plato = { id: number; ... };       // backend: "idPlato"
export type Categoria = { id: number; ... };   // backend: "idCategoria"

// DESPUÉS ✓
export type Plato = { idPlato: number; ... };
export type Categoria = { idCategoria: number; ... };
```

---

## 2. Frontend — `app/user/mozo/page.tsx`

### El problema
Dos bugs que causaban el crash "a los 2 segundos":

**Bug 1:** La referencia al enum cambiado.
```tsx
// ANTES ❌
[EstadoComanda.Pendiente]: "comanda-pendiente"

// DESPUÉS ✓
[EstadoComanda.Abierta]: "comanda-pendiente"
```

**Bug 2:** Campo incorrecto en el render.
```tsx
// ANTES ❌ — "estadoComanda" no es "estado", TypeScript error + undefined
<div className={`... ${colorByState[comanda.estado]}`}>

// DESPUÉS ✓
<div className={`... ${colorByState[comanda.estadoComanda]}`}>
```

**Bug 3:** `fetchComandas()` no tenía manejo de errores — un error de red tiraba una excepción no capturada que podía crashear la página en dev mode.
```tsx
// ANTES ❌ — sin try/catch, error de red = crash
const fetchComandas = async () => {
  const response = await fetch(...);
  // si falla, explota
}

// DESPUÉS ✓ — error controlado, la página no se rompe
const fetchComandas = async () => {
  try {
    const response = await fetch(...);
    if (!response.ok) { console.error(...); return; }
    setComandas(await response.json());
  } catch (error) {
    console.error('Error al obtener comandas:', error);
  }
}
```

---

## 3. Frontend — `app/ui/mozo/command-detail.tsx`

### El problema
Este era el **crash principal** de la página del mozo. El componente accedía a `command.mozo.nombre`, pero el backend devuelve `mozos` (un array), no `mozo` (un objeto). Acceder `.nombre` sobre `undefined` tira `TypeError`.

```tsx
// ANTES ❌ — crash garantizado: "Cannot read properties of undefined (reading 'nombre')"
Mesa N°{command.numero_mesa}
#{command.numero_comanda}
{command.estado}
{command.mozo.nombre}

// DESPUÉS ✓
Mesa N°{command.mesa.numeroMesa}
#{command.numeroComanda}
{command.estadoComanda}
{command.mozos[0]?.nombre ?? 'Sin mozo'}
// mozos[0] toma el primer mozo del array
// ?. evita crash si el array está vacío
// ?? 'Sin mozo' muestra un texto por defecto
```

---

## 4. Frontend — Tablas del admin (4 componentes)

### El problema
Ninguna de las tablas del admin llamaba al backend. Tenían el estado (`useState`) pero nunca lo llenaban. Resultado: tablas siempre vacías.

Se agregó `useEffect` a cada uno:

### `app/ui/staff/table-staff.tsx`
```tsx
useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios`)
        .then(res => res.json())
        .then(data => setStaff(data))
        .catch(console.error);
}, []);
```
También se corrigió `user.id` → `user.idUsuario` en el `key` del map.

### `app/ui/stock/table-stock.tsx`
```tsx
useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes`)
        .then(res => res.json())
        .then(data => setIngredientes(data))
        .catch(console.error);
}, []);
```
También se corrigió:
- `ingrediente.id` → `ingrediente.idIngrediente`
- `ingrediente.stock_mininmo` → `ingrediente.stockMinimo` (en filtros y en `getCondicion`)
- `ing.id` → `ing.idIngrediente` en `handleStockUpdate`

### `app/ui/stock/table-movements.tsx`
```tsx
useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movimientos-stock`)
        .then(res => res.json())
        .then(data => setMovements(data))
        .catch(console.error);
}, []);
```
También se corrigió:
- `mov.id` → `mov.idMov`
- `mov.cant` → `mov.cantidad`
- `mov.fecha.toLocaleDateString()` → `new Date(mov.fecha).toLocaleDateString()`  
  *(El JSON devuelve `fecha` como string ISO, no como objeto `Date`. Hay que convertirlo antes de llamar métodos de Date.)*

### `app/ui/admin/StockAlerts.tsx`
```tsx
useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes/bajo-stock`)
        .then(res => res.json())
        .then(data => setAlerts(data))
        .catch(console.error);
}, []);
```
También se corrigió `alert.stock_mininmo` → `alert.stockMinimo` y se agregó `key={alert.idIngrediente}`.

---

## 5. Frontend — `app/menu/page.tsx`

```tsx
// ANTES ❌ — item.id era undefined, el Link iba a "/menu/course/undefined"
<div key={item.id}>
  <Link href={`/menu/course/${item.id}`}>

// DESPUÉS ✓
<div key={item.idPlato}>
  <Link href={`/menu/course/${item.idPlato}`}>
```

---

## 6. Backend — `@JsonIgnoreProperties` en modelos con relaciones lazy

### El problema
Los modelos con `FetchType.LAZY` pueden tener problemas de serialización con Jackson porque Hibernate envuelve las entidades en proxies que tienen propiedades internas (`hibernateLazyInitializer`, `handler`). Sin la anotación, Jackson puede fallar al intentar serializar esas propiedades.

`Mesa` ya tenía esta anotación. Se agregó a los tres modelos que la necesitaban:

### `model/Usuario.java`
```java
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "usuario")
public class Usuario { ... }
```

### `model/Ingrediente.java`
```java
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "ingrediente")
public class Ingrediente { ... }
```

### `model/Categoria.java`
```java
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "categoria")
public class Categoria { ... }
```

---

## 7. Backend — Nuevo endpoint `GET /api/movimientos-stock`

### El problema
El controller de movimientos de stock solo tenía endpoints filtrados por ingrediente o por usuario. No había forma de obtener todos los movimientos para mostrar el historial completo en el admin.

### `service/MovStockService.java`
```java
// Método nuevo agregado
public List<MovStock> obtenerTodos() {
    return movStockRepository.findAll(); // findAll() ya existe en JpaRepository
}
```

### `controller/MovimientoStockController.java`
```java
// Endpoint nuevo agregado
@GetMapping
public ResponseEntity<List<MovStock>> obtenerTodos() {
    return ResponseEntity.ok(movStockService.obtenerTodos());
}
```

---

## Resumen de archivos modificados

| Archivo | Tipo | Cambio |
|---|---|---|
| `Frontend/app/lib/definitions.ts` | Frontend | Corrección masiva de tipos para coincidir con JSON del backend |
| `Frontend/app/user/mozo/page.tsx` | Frontend | Fix enum + campo + manejo de errores |
| `Frontend/app/ui/mozo/command-detail.tsx` | Frontend | Fix campos `mozos[]`, `mesa.numeroMesa`, etc. |
| `Frontend/app/ui/staff/table-staff.tsx` | Frontend | Agregado `useEffect` + fix `idUsuario` |
| `Frontend/app/ui/stock/table-stock.tsx` | Frontend | Agregado `useEffect` + fix `idIngrediente`, `stockMinimo` |
| `Frontend/app/ui/stock/table-movements.tsx` | Frontend | Agregado `useEffect` + fix `idMov`, `cantidad`, conversión de fecha |
| `Frontend/app/ui/admin/StockAlerts.tsx` | Frontend | Agregado `useEffect` + fix `stockMinimo` |
| `Frontend/app/menu/page.tsx` | Frontend | Fix `item.idPlato` en key y Link |
| `Backend/.../model/Usuario.java` | Backend | Agregado `@JsonIgnoreProperties` |
| `Backend/.../model/Ingrediente.java` | Backend | Agregado `@JsonIgnoreProperties` |
| `Backend/.../model/Categoria.java` | Backend | Agregado `@JsonIgnoreProperties` |
| `Backend/.../service/MovStockService.java` | Backend | Nuevo método `obtenerTodos()` |
| `Backend/.../controller/MovimientoStockController.java` | Backend | Nuevo endpoint `GET /movimientos-stock` |

---

## Para que el backend tome los cambios

Los cambios en archivos Java requieren **reiniciar el backend**:

```powershell
# Desde la carpeta Backend/
.\mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

Los cambios en el frontend (Next.js) se aplican automáticamente con hot reload si el servidor de desarrollo ya está corriendo.
