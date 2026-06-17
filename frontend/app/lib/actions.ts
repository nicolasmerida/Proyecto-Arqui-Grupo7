'use server';

import { ComandaResumen, ComandaDetalle } from "./definitions";

// Usa la URL configurada en el entorno o un fallback local para el backend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Obtiene todas las comandas desde el backend.
 */
export async function getComandas(): Promise<ComandaResumen[]> {
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
 * Obtiene las comandas relevantes para la vista de cocina desde el backend con detalles.
 */
export async function getComandasCocina(): Promise<ComandaDetalle[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/comandas/activas`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} al consultar comandas de cocina`);
    }

    const comandas: ComandaDetalle[] = await response.json();
    return comandas;
  } catch (error) {
    console.error("Error en getComandasCocina action:", error);
    return [];
  }
}

/**
 * Obtiene todas las alertas de ingredientes con bajo stock desde el backend.
 */
export async function getAlertasStock() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ingredientes/bajo-stock`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} al consultar alertas de stock`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAlertasStock action:", error);
    return [];
  }
}
