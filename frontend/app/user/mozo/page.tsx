// app/user/mozo/page.tsx
import { getComandas } from "@/app/lib/actions";
import MozoDashboard from "@/app/ui/mozo/mozo-dashboard";

export const dynamic = 'force-dynamic';

import { ComandaResumen } from "@/app/lib/definitions";

// Eliminar 'use client' - Esto ahora es un Server Component
export default async function Mozo() {
  // Obtiene el estado inicial de las comandas usando SSR y Server Actions
  // Sin necesidad de exponer endpoints del backend al navegador (excepto websocket)
  let comandas: ComandaResumen[] = [];
  try {
    comandas = await getComandas();
  } catch (error) {
    console.error("Error al obtener comandas iniciales:", error);
    // Podríamos renderizar un componente de error aquí si falla la inicialización
  }

  return (
    // Pasamos el estado inicial al Client Component que maneja la reactividad y WebSockets
    <MozoDashboard initialComandas={comandas} />
  );
}