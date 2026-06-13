'use server';

import { Comanda } from "./definitions";

// Usa la URL configurada en el entorno o un fallback local para el backend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Obtiene todas las comandas desde el backend.
 */
export async function getComandas(): Promise<Comanda[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/comandas`, {
      cache: 'no-store', // Para asegurar datos frescos en renderizado inicial SSR
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status} inesperado al consultar comandas`;
      let errorCode = `ERROR_DESCONOCIDO`;

      try {
        const errorData = await response.json();
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
          errorCode = errorData.error.code || errorCode;
        }
      } catch (e) {
        // Fallback default error
      }

      throw new Error(errorMessage, { cause: errorCode });
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getComandas action:", error);
    throw error;
  }
}

/**
 * Obtiene todas las alertas de ingredientes con bajo stock desde el backend.
 */
export async function getAlertasStock() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ingredientes/bajo-stock`, {
      cache: 'no-store', // Para asegurar datos frescos
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} al consultar alertas de stock`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAlertasStock action:", error);
    // Devuelve un arreglo vacío en caso de error para no romper la UI
    return [];
  }
}

/**
 * Obtiene las comandas relevantes para la vista de cocina desde el backend.
 */
export async function getComandasCocina(): Promise<Comanda[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/comandas`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} al consultar comandas de cocina`);
    }

    const comandas: Comanda[] = await response.json();
    // Podríamos filtrar aquí por estados relevantes para la cocina (ej. ABIERTA, EN_PREPARACION, LISTA) 
    // si el backend devuelve todas. Para asegurar compatibilidad lo devolvemos tal cual por ahora 
    // o aplicamos el filtro si es requerido por el dashboard.
    return comandas;
  } catch (error) {
    console.error("Error en getComandasCocina action:", error);
    return [];
  }
}
