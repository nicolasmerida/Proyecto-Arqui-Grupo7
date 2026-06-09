# Correcciones Frontend ↔ Backend — Sincronización de tipos y datos

**Fecha inicial:** 08/06/2026  
**Última actualización:** 08/06/2026  
**Rama de trabajo:** `NicoFrontend`  
**Commit base:** `1bf5322` → Actualizado sobre `c907efe` (pull de main antes de commitear)

---

## Contexto general del problema

El frontend y el backend nunca habían conectado datos reales de forma exitosa. Había **dos categorías de problemas**:

1. **Crashes reales** — páginas que rompían al recibir datos del backend porque los nombres de campos en el JSON no coincidían con lo que el frontend esperaba.
2. **Datos que nunca cargaban** — tablas del admin que siempre aparecían vacías porque les faltaba el `useEffect` para llamar al backend.
3. **Funcionalidades sin implementar** — componentes con estructura básica pero sin lógica real (plano del salón, detalle de comanda, alta de ingredientes, etc.).

---

## Sesión 1 — Sincronización de tipos y corrección de crashes

---

### 1. Frontend — `app/lib/definitions.ts`

#### El problema
Los tipos TypeScript del frontend usaban nombres de campos inventados que **no coincidían con los nombres que Jackson/Spring serializa** desde los modelos Java.

Jackson serializa los campos Java con su nombre camelCase exacto. Por ejemplo, el campo Java `private Integer idIngrediente` se convierte en `"idIngrediente"` en el JSON — no en `"id"`.

#### Cambios realizados

**`EstadoComanda` — valor incorrecto**
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

**`Comanda` — todos los campos estaban mal**
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

**`Ingrediente` — `id` mal y typo en `stock_mininmo`**
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

**`Item_Pedido` — estructura totalmente diferente al backend**
```typescript
// ANTES ❌ — estructura inventada, no coincide con el modelo Java
export type Item_Pedido = {
  id: number;
  cant: number;
  notas: string;
  estado: EstadoItem;
  nComanda: number;
  plato: Plato;
};

// DESPUÉS ✓ — coincide con ItemPedido.java que tiene clave compuesta @EmbeddedId
export type Item_Pedido = {
  id: { numeroComanda: number; idPlato: number }; // clave primaria compuesta
  comanda: { numeroComanda: number };
  plato: Plato;
  cantidad: number;   // era "cant"
  notas: string;
  estadoItem: EstadoItem; // era "estado"
};
```

> **Por qué el ID es un objeto:** En la base de datos, `item_pedido` tiene una clave primaria compuesta `(numero_comanda, id_plato)`. En Java esto se modela con `@EmbeddedId ItemPedidoId`. Cuando Spring serializa la entidad, el campo `id` es ese objeto compuesto, no un número simple.

**`Mov_Stock` — tres campos incorrectos**
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

**`Usuario`, `Plato`, `Categoria`, `Mesa` — IDs y campos con nombres distintos**
```typescript
// ANTES ❌
export type Usuario  = { id: number; contraseña: string; ... };
export type Plato    = { id: number; ... };
export type Categoria= { id: number; ... };
export type Mesa     = { numero: number; estado: EstadoMesa; hora_apertura: Date | null; };

// DESPUÉS ✓
export type Usuario  = { idUsuario: number; password: string; estado?: EstadoUsuario; ... };
export type Plato    = { idPlato: number; ... };
export type Categoria= { idCategoria: number; ... };
export type Mesa     = { numeroMesa: number; estadoMesa: EstadoMesa; horaDeApertura: string | null; ... };
```

---

### 2. Frontend — `app/user/mozo/page.tsx`

#### El problema
Dos bugs causaban el crash "a los 2 segundos":

**Bug 1:** Referencia al enum cambiado.
```tsx
// ANTES ❌
[EstadoComanda.Pendiente]: "comanda-pendiente"

// DESPUÉS ✓
[EstadoComanda.Abierta]: "comanda-pendiente"
```

**Bug 2:** Campo incorrecto en el render.
```tsx
// ANTES ❌
<div className={`... ${colorByState[comanda.estado]}`}>

// DESPUÉS ✓
<div className={`... ${colorByState[comanda.estadoComanda]}`}>
```

**Bug 3:** Sin manejo de errores en el fetch.
```tsx
// ANTES ❌ — error de red = excepción no capturada
const fetchComandas = async () => {
  const response = await fetch(...);
}

// DESPUÉS ✓
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

### 3. Frontend — `app/ui/mozo/command-detail.tsx`

#### El problema
El componente accedía a `command.mozo.nombre`, pero el backend devuelve `mozos` (array). Acceder `.nombre` sobre `undefined` tira `TypeError`.

```tsx
// ANTES ❌ — crash: "Cannot read properties of undefined (reading 'nombre')"
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

### 4. Frontend — Tablas del admin (4 componentes)

#### El problema
Ninguna tabla del admin llamaba al backend. Tenían `useState` pero nunca lo llenaban. Resultado: tablas siempre vacías.

**`app/ui/staff/table-staff.tsx`**
```tsx
useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios`)
        .then(res => res.json())
        .then(data => setStaff(data))
        .catch(console.error);
}, []);
```
También se corrigió `user.id` → `user.idUsuario`.

**`app/ui/stock/table-movements.tsx`**
```tsx
useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movimientos-stock`)
        .then(res => res.json())
        .then(data => setMovements(data))
        .catch(console.error);
}, []);
```
También se corrigió: `mov.id` → `mov.idMov`, `mov.cant` → `mov.cantidad`, y `mov.fecha.toLocaleDateString()` → `new Date(mov.fecha).toLocaleDateString()` (el JSON devuelve la fecha como string ISO, no como objeto `Date`).

**`app/ui/admin/StockAlerts.tsx`**
```tsx
useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes/bajo-stock`)
        .then(res => res.json())
        .then(data => setAlerts(data))
        .catch(console.error);
}, []);
```
También se corrigió `alert.stock_mininmo` → `alert.stockMinimo`.

---

### 5. Backend — `@JsonIgnoreProperties` en modelos con relaciones lazy

#### El problema
Los modelos con `FetchType.LAZY` son envueltos por Hibernate en objetos proxy que contienen propiedades internas (`hibernateLazyInitializer`, `handler`). Sin la anotación, Jackson puede intentar serializar esas propiedades y fallar con un error de serialización.

`Mesa` ya tenía esta anotación. Se agregó a `Usuario`, `Ingrediente` y `Categoria`:

```java
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
public class Ingrediente { ... }
```

---

### 6. Backend — Nuevo endpoint `GET /api/movimientos-stock`

#### El problema
El controller solo tenía endpoints filtrados. No había forma de obtener todos los movimientos para el historial completo del admin.

```java
// MovStockService.java — método nuevo
public List<MovStock> obtenerTodos() {
    return movStockRepository.findAll();
}

// MovimientoStockController.java — endpoint nuevo
@GetMapping
public ResponseEntity<List<MovStock>> obtenerTodos() {
    return ResponseEntity.ok(movStockService.obtenerTodos());
}
```

---

### 7. Frontend — `app/ui/stock/AddStock.tsx`

#### El problema
El botón "Confirmar" no hacía nada — `handleAdd` llamaba a `onStockUpdate()` sin parámetros y sin comunicarse con el backend.

```tsx
// ANTES ❌ — no hace nada real
const handleAdd = async () => {
    onStockUpdate(); // sin argumento, sin llamada al backend
    setNewStock(0);
    onClose();
};

// DESPUÉS ✓ — llama al backend y actualiza el estado local
const handleAdd = async () => {
    if (!ingredient || newStock <= 0) return;
    setLoading(true);
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes/${ingredient.idIngrediente}/stock?cantidad=${newStock}`,
            { method: 'PUT' }
        );
        if (!response.ok) { setError('Error al registrar el ingreso.'); return; }
        const updatedIng = await response.json();
        onStockUpdate(updatedIng); // actualiza la fila en la tabla sin recargar
        setNewStock(0);
        onClose();
    } catch {
        setError('No se pudo conectar con el servidor.');
    } finally {
        setLoading(false);
    }
};
```

También se agregó: estado `loading` (deshabilita el botón mientras espera), estado `error` (muestra el mensaje en rojo si falla).

---

### 8. Frontend — `app/ui/stock/CreateIngrediente.tsx` (archivo nuevo)

#### Por qué se creó
La tabla de stock no tenía forma de agregar nuevos ingredientes. Sin ingredientes en la base de datos, la tabla siempre aparecía vacía y no había forma de registrar movimientos de stock.

#### Qué hace
Modal con formulario para crear un ingrediente nuevo:
- Campos: nombre, stock inicial, stock mínimo, unidad (kg / g / l / ml / u)
- Llama a `POST /api/ingredientes`
- Al crear exitosamente, llama al callback `onCreated(nuevoIngrediente)` para agregarlo a la tabla sin recargar la página
- Tiene estados `loading` y `error`

```tsx
// Cuerpo del POST
{
  nombre: string,
  stock: number,
  stockMinimo: number,
  unidad: string   // "kg" | "g" | "l" | "ml" | "u"
}
```

---

### 9. Frontend — `app/ui/stock/table-stock.tsx` — columna Mínimo y botón Ingreso

#### El problema
La tabla tenía 5 cabeceras (`<th>`) pero solo 4 celdas (`<td>`) por fila. El botón de "Ingreso" ocupaba la celda de "Mínimo", por lo que nunca se mostraba el valor mínimo de stock y el botón aparecía en la columna equivocada.

```
ANTES — 5 th, 4 td (desalineado):
| Ingrediente | Stock actual | Condición | Mínimo (muestra el botón!) |

DESPUÉS — 5 th, 5 td (alineado):
| Ingrediente | Stock actual | Condición | Mínimo (valor numérico) | (botón Ingreso) |
```

Se corrigió agregando el `<td>` con `stockMinimo` en su propia celda y moviendo el botón a una columna de acciones separada.

---

## Sesión 2 — Funcionalidades del mozo y flujo de pedidos

---

### 10. Frontend — `app/ui/stock/table-stock.tsx` — Ingreso de stock

#### Qué se hizo
El botón de Ingreso se había retirado de la tabla en una limpieza anterior. Se reintegró correctamente en una columna de acciones (`<th>` vacío al final), con el estado y los handlers necesarios para abrir el modal `AddStock` al clickar sobre un ingrediente específico.

> **Por qué importa:** Sin el botón de Ingreso no hay forma de registrar entradas de stock. Y sin entradas de stock, la tabla de movimientos (`/admin/movements`) siempre aparece vacía, ya que los movimientos se generan automáticamente en el backend cuando se llama a `PUT /api/ingredientes/{id}/stock`.

---

### 11. Frontend — `app/ui/mozo/plano-salon.tsx` — Implementación completa

#### El problema
El componente era un esqueleto con comentarios tipo `{/* Cuadricula con las mesas */}`. No mostraba nada y no tenía lógica alguna. El mozo no tenía ninguna forma de ver ni seleccionar mesas.

#### Qué se implementó
Un plano de salón funcional que:

1. **Trae las mesas reales del backend** al montar el componente:
   ```tsx
   useEffect(() => {
       fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mesas`)
           .then(res => res.json())
           .then(setMesas)
           .catch(console.error);
   }, []);
   ```

2. **Muestra las mesas en grilla** agrupadas por sector (Salón / Terraza), con filtro de vista:
   - **Verde** = Libre → clickeable
   - **Rojo** = Ocupada → deshabilitada visualmente

3. **Al clickar una mesa libre** abre un modal que pide la cantidad de comensales.

4. **Al confirmar**, ejecuta el flujo completo en secuencia:
   ```
   PUT /api/mesas/{numero}/abrir?numeroComensales={n}
        ↓ (abre la mesa en la BD)
   POST /api/comandas  body: { estadoComanda: "ABIERTA", mesa: { numeroMesa: n } }
        ↓ (crea la comanda y devuelve su número)
   router.push(`/user/mozo/menu?comanda=${comanda.numeroComanda}`)
        ↓ (navega a la pantalla de toma de pedido)
   ```

5. **Actualiza el estado local** para que la mesa pase a roja inmediatamente, sin esperar un nuevo fetch.

---

### 12. Frontend — `app/user/mozo/menu/page.tsx` — Bug crítico: async + useState

#### El problema
La página combinaba `async function` con `useState`, lo cual es **imposible en Next.js App Router**. Los componentes `async` son Server Components (se ejecutan en el servidor) y los hooks como `useState` solo pueden usarse en Client Components (se ejecutan en el navegador). Mezclarlos produce un error en runtime.

```tsx
// ANTES ❌ — Next.js tira error: hooks en server component
export default async function MozoMenu({ searchParams }) {
    const numeroComanda = Number((await searchParams)?.comanda);
    const [itemsComanda, setItemsComanda] = useState<Item_Pedido[]>([]); // ERROR
    ...
}
```

#### Solución: separar responsabilidades (principio de Single Responsibility)
Se dividió en dos componentes, cada uno con una sola responsabilidad:

**`mozo/menu/page.tsx` — Server Component**
Solo lee parámetros y fetcha los platos. No tiene estado ni interacción:
```tsx
export default async function MozoMenuPage({ searchParams }) {
    const params = await searchParams;
    const numeroComanda = Number(params?.comanda ?? 0);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menu?page=0`);
    const platos = res.ok ? (await res.json()).content ?? [] : [];

    return <MozoMenuClient platos={platos} numeroComanda={numeroComanda} />;
}
```

**`app/ui/mozo/MozoMenuClient.tsx` — Client Component (nuevo)**
Solo maneja estado e interacción. Recibe los platos ya cargados como prop:
```tsx
'use client';
export default function MozoMenuClient({ platos, numeroComanda }) {
    const [itemsComanda, setItemsComanda] = useState<Item_Pedido[]>([]);

    const agregarItem = (plato, nota) => {
        // Si el plato ya está en la comanda con las mismas notas → incrementa cantidad
        // Si no → lo agrega como nuevo ítem
    };

    return (
        <div className="flex flex-row gap-4">
            <MenuList items={platos} addItem={agregarItem} />
            <CommandDetail items={itemsComanda} numeroComanda={numeroComanda} onConfirmed={() => setItemsComanda([])} />
        </div>
    );
}
```

> **Por qué este patrón:** Es el patrón estándar de Next.js App Router. El servidor hace el trabajo pesado (fetch de datos), el cliente maneja la interactividad. Así se evita enviar lógica de servidor al navegador innecesariamente.

---

### 13. Frontend — `app/ui/commands/CommandDetail.tsx` — Implementación completa

#### El problema
El componente era un esqueleto casi vacío. No mostraba los ítems seleccionados, no calculaba el total y el botón "Confirmar" no hacía nada.

#### Qué se implementó
Un panel lateral de comanda que:

1. **Muestra la lista de ítems** con nombre, notas, cantidad y subtotal por ítem.
2. **Calcula el total** en tiempo real conforme se agregan platos.
3. **Al confirmar**, envía cada ítem al backend con `POST /api/items-pedido`:
   ```tsx
   for (const item of items) {
       await fetch(`${BACKEND}/api/items-pedido`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(item),  // estructura coincide con ItemPedido.java
       });
   }
   ```
4. **Muestra estados de carga y error** para dar feedback al mozo.
5. Después de confirmar exitosamente, llama a `onConfirmed()` para vaciar la lista (la comanda ya está guardada en el backend).

> **Por qué un loop de POST y no un endpoint bulk:** El backend solo expone `POST /api/items-pedido` para un ítem a la vez. Si en el futuro se agrega un endpoint para enviar múltiples ítems, solo habría que cambiar el `handleConfirmar`.

---

### 14. Frontend — `app/ui/menu/MenuList.tsx` — Fix `item.id`

```tsx
// ANTES ❌ — item.id es undefined, React muestra warning de key duplicado
<CourseCard key={item.id} course={item} />

// DESPUÉS ✓
<CourseCard key={item.idPlato} course={item} />
```

---

## Flujo completo del mozo (resumen)

```
1. Mozo ingresa a su página (/user/mozo)
2. PlanoSalon fetcha GET /api/mesas → muestra grilla de mesas
3. Mozo clickea una mesa LIBRE
4. Modal pide cantidad de comensales
5. Al confirmar:
   → PUT /api/mesas/{n}/abrir?numeroComensales={x}
   → POST /api/comandas { estadoComanda: "ABIERTA", mesa: { numeroMesa: n } }
   → Navega a /user/mozo/menu?comanda={id}
6. MozoMenuPage fetcha GET /api/menu → lista de platos
7. Mozo selecciona platos → se acumulan en el CommandDetail
8. Al confirmar pedido:
   → POST /api/items-pedido por cada ítem
9. La comanda queda guardada con estado ABIERTA, lista para que cocina la procese
```

---

## Flujo completo del stock (resumen)

```
1. Admin va a /user/admin/stock
2. TableStock fetcha GET /api/ingredientes → muestra lista
3. Para agregar ingrediente nuevo: botón "Nuevo ingrediente" → modal CreateIngrediente
   → POST /api/ingredientes
4. Para registrar un ingreso: botón "Ingreso" en cada fila → modal AddStock
   → PUT /api/ingredientes/{id}/stock?cantidad={n}
   → El backend crea automáticamente un MovStock en la BD
5. Admin va a /user/admin/movements
6. TableMovements fetcha GET /api/movimientos-stock → muestra historial
```

---

## Resumen de todos los archivos modificados

| Archivo | Tipo | Cambio |
|---|---|---|
| `Frontend/app/lib/definitions.ts` | Frontend | Corrección masiva de tipos + `Item_Pedido` reestructurado |
| `Frontend/app/user/mozo/page.tsx` | Frontend | Fix enum + campo + manejo de errores |
| `Frontend/app/user/mozo/menu/page.tsx` | Frontend | Refactor: ahora Server Component correcto |
| `Frontend/app/ui/mozo/plano-salon.tsx` | Frontend | Implementación completa desde cero |
| `Frontend/app/ui/mozo/MozoMenuClient.tsx` | Frontend | **Archivo nuevo** — Client Component para estado de comanda |
| `Frontend/app/ui/mozo/command-detail.tsx` | Frontend | Fix campos mozos/mesa/estado |
| `Frontend/app/ui/commands/CommandDetail.tsx` | Frontend | Implementación completa con POST al backend |
| `Frontend/app/ui/menu/MenuList.tsx` | Frontend | Fix `item.idPlato` en key |
| `Frontend/app/ui/staff/table-staff.tsx` | Frontend | Agregado `useEffect` + fix `idUsuario` |
| `Frontend/app/ui/stock/table-stock.tsx` | Frontend | `useEffect` + fix campos + columna Mínimo + botón Ingreso |
| `Frontend/app/ui/stock/table-movements.tsx` | Frontend | `useEffect` + fix `idMov`, `cantidad`, fecha |
| `Frontend/app/ui/stock/AddStock.tsx` | Frontend | Implementación real del PUT al backend |
| `Frontend/app/ui/stock/CreateIngrediente.tsx` | Frontend | **Archivo nuevo** — modal para POST /api/ingredientes |
| `Frontend/app/ui/admin/StockAlerts.tsx` | Frontend | `useEffect` + fix `stockMinimo` |
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

Los cambios en el frontend (Next.js) se aplican automáticamente con hot reload si el servidor de desarrollo ya está corriendo (`npm run dev` desde la carpeta `Frontend/`).

> **Nota sobre credenciales:** El archivo `Backend/src/main/resources/application-local.properties` contiene las credenciales de NeonDB y **no está commiteado** (está en `.gitignore`). Cada desarrollador debe tener su propia copia local con las credenciales reales.
