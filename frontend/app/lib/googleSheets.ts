// app/lib/googleSheets.ts

const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

// Crea una nueva hoja de cálculo y devuelve su ID
async function crearHoja(accessToken: string, titulo: string): Promise<string> {
  const response = await fetch(SHEETS_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: { title: titulo },
    }),
  });

  if (!response.ok) throw new Error("No se pudo crear la hoja de cálculo");
  const data = await response.json();
  return data.spreadsheetId;
}

// Escribe datos en una hoja específica dentro del spreadsheet
async function escribirDatos(
  accessToken: string,
  spreadsheetId: string,
  nombreHoja: string,
  encabezados: string[],
  filas: (string | number | null)[][]
) {
  // 1) Validar creación de la pestaña
  const addSheetRes = await fetch(`${SHEETS_API}/${spreadsheetId}:batchUpdate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [{ addSheet: { properties: { title: nombreHoja } } }],
    }),
  });
  if (!addSheetRes.ok) {
    throw new Error(`No se pudo crear la hoja "${nombreHoja}"`);
  }
  // 2) Validar escritura de datos
  const valores = [encabezados, ...filas];
  const writeRes = await fetch(
    `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(`'${nombreHoja}'!A1`)}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: valores }),
    }
  );
  if (!writeRes.ok) {
    throw new Error(`No se pudieron escribir datos en "${nombreHoja}"`);
  }
}

// Función principal que el botón va a llamar
export async function exportarTodo(accessToken: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const fecha = new Date().toLocaleDateString("es-AR");
  const titulo = `Restaurante - Exportación ${fecha}`;

  // Crear el spreadsheet
  const spreadsheetId = await crearHoja(accessToken, titulo);

  // Obtener y escribir movimientos de stock
  const resMov = await fetch(`${backendUrl}/api/movimientos-stock`);
  if (!resMov.ok) throw new Error("Error al obtener movimientos");
  // Obtener y escribir comandas
  const resCom = await fetch(`${backendUrl}/api/comandas`);
  if (!resCom.ok) throw new Error("Error al obtener comandas");
  // Obtener y escribir ingredientes/stock
  const resIng = await fetch(`${backendUrl}/api/ingredientes`);
  if (!resIng.ok) throw new Error("Error al obtener ingredientes");
  // Obtener y escribir platos
  const resPla = await fetch(`${backendUrl}/api/platos`);
  if (!resPla.ok) throw new Error("Error al obtener platos");

  const [movimientos, comandas, ingredientes, platos] = await Promise.all([
    resMov.json(),
    resCom.json(),
    resIng.json(),
    resPla.json(),
  ]);

  // Movimientos de stock
  await escribirDatos(
    accessToken,
    spreadsheetId,
    "Movimientos de Stock",
    ["ID", "Ingrediente", "Cantidad", "Fecha", "Usuario"],
    movimientos.map((m: any) => [
      m.idMov,
      m.nombreIngrediente,
      m.cantidad,
      m.fecha,
      m.nombreUsuario,
    ])
  );

  // Comandas
  await escribirDatos(
    accessToken,
    spreadsheetId,
    "Comandas",
    ["N° Comanda", "Mesa", "Estado", "Fecha"],
    comandas.map((c: any) => [
      c.numeroComanda,
      c.mesa?.numeroMesa,
      c.estadoComanda,
      c.fecha,
    ])
  );

  // Ingredientes
  await escribirDatos(
    accessToken,
    spreadsheetId,
    "Ingredientes",
    ["ID", "Nombre", "Stock Actual", "Stock Mínimo", "Unidad"],
    ingredientes.map((i: any) => [
      i.idIngrediente,
      i.nombre,
      i.stock,
      i.stockMinimo,
      i.unidad,
    ])
  );

  // Platos
  await escribirDatos(
    accessToken,
    spreadsheetId,
    "Platos",
    ["ID", "Nombre", "Precio", "Categoría", "Activo"],
    platos.map((p: any) => [
      p.idPlato,
      p.nombre,
      p.precio,
      p.categoria?.nombre,
      p.activo ? "Sí" : "No",
    ])
  );

  // después de escribir todas las pestañas
const meta = await fetch(`${SHEETS_API}/${spreadsheetId}`, {
  headers: { Authorization: `Bearer ${accessToken}` },
});
if (!meta.ok) throw new Error("No se pudo leer metadata del spreadsheet");
const { sheets } = await meta.json();
const sheet1 = sheets?.find((s: any) => s.properties.title === "Sheet1");
if (sheet1) {
  const deleteRes = await fetch(`${SHEETS_API}/${spreadsheetId}:batchUpdate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [{ deleteSheet: { sheetId: sheet1.properties.sheetId } }],
    }),
  });
  if (!deleteRes.ok) throw new Error("No se pudo eliminar la pestaña Sheet1");
}

  // Devuelve el link directo a la hoja
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
}