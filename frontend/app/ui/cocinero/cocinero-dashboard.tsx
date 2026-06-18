'use client';
import { ComandaResumen, ComandaDetalle, EstadoComanda, Item_Pedido } from "@/app/lib/definitions";
import CommandCard from "@/app/ui/cocinero/command-cocinero";
import { useState, useCallback } from "react";
import { useStompClient } from "@/app/lib/hooks/useStompClient";

interface CocineroDashboardProps {
  initialComandas: ComandaDetalle[];
}

export default function CocineroDashboard({ initialComandas }: CocineroDashboardProps) {
  const [comandas, setComandas] = useState<ComandaDetalle[]>(initialComandas);

  // 1. Suscripción a cambios en COMANDAS (ej. cuando cambia a estado lista/preparacion)
  const onComandaReceived = useCallback((comanda: ComandaResumen) => {
    setComandas((prev) => {
      const idx = prev.findIndex(c => c.numeroComanda === comanda.numeroComanda);
      if (idx >= 0) {
        const next = [...prev];
        // Si la comanda se cerró/canceló/entregó, la quitamos de la vista
        if ([EstadoComanda.Cerrada, EstadoComanda.Cancelada, EstadoComanda.Entregada].includes(comanda.estadoComanda)) {
          return prev.filter(c => c.numeroComanda !== comanda.numeroComanda);
        }
        // Solo actualizamos el estado, preservamos los items que ya teníamos
        next[idx] = { ...next[idx], estadoComanda: comanda.estadoComanda };
        return next;
      } else {
        if ([EstadoComanda.Abierta, EstadoComanda.Preparacion].includes(comanda.estadoComanda)) {
          return [...prev, { ...comanda, items: [] as Item_Pedido[] }];
        }
        return prev;
      }
    });
  }, []);

  // 2. Suscripción a la vista de cocina (Recibe la comanda detallada actualizada)
  const onItemReceived = useCallback((comandaDetalle: ComandaDetalle) => {
    // Al recibir el detalle actualizado, reemplazamos la comanda entera
    setComandas(prev => {
      const idx = prev.findIndex(c => c.numeroComanda === comandaDetalle.numeroComanda);
      // Si la comanda cambió a estado entregada, cerrada o cancelada, la quitamos (por si el backend manda el update)
      if ([EstadoComanda.Cerrada, EstadoComanda.Cancelada, EstadoComanda.Entregada].includes(comandaDetalle.estadoComanda)) {
        return prev.filter(c => c.numeroComanda !== comandaDetalle.numeroComanda);
      }

      if (idx >= 0) {
        const next = [...prev];
        next[idx] = comandaDetalle;
        return next;
      }
      return [...prev, comandaDetalle];
    });
  }, []);

  const { connected: connectedComandas } = useStompClient<ComandaResumen>('/topic/comanda', onComandaReceived);
  const { connected: connectedCocina } = useStompClient<ComandaDetalle>('/topic/cocina', onItemReceived);

  const connected = connectedComandas && connectedCocina;

  // Filtramos solo las que nos importan, QUE TENGAN ÍTEMS, y ordenamos por fecha de más antigua a más nueva
  const activas = comandas
    .filter(c => [EstadoComanda.Abierta, EstadoComanda.Preparacion].includes(c.estadoComanda))
    .filter(c => c.items && c.items.length > 0)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return (
    <div className="flex flex-col flex-1 items-center relative w-full pb-10">
      {/* Indicador de WebSockets */}
      {!connected && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-red-500 font-medium z-10 bg-white/80 px-3 py-1 rounded-full shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Desconectado
        </div>
      )}

      {/* Titulo */}
      <div className="w-full max-w-7xl px-8 pt-8 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Cocina en Vivo</h1>
          <p className="text-gray-300 mt-1">Comandas activas ordenadas por tiempo de espera</p>
        </div>
        <div className="text-sm font-medium text-gray-300">
          Total Activas: {activas.length}
        </div>
      </div>

      {/* Grilla principal */}
      <div className="w-full max-w-screen-2xl px-8">
        {activas.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6 items-start auto-rows-max">
            {activas.map((comanda) => (
              <CommandCard key={comanda.numeroComanda} command={comanda} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-[50vh] text-gray-400">
            <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <p className="text-xl font-medium">¡Excelente trabajo!</p>
            <p>No hay comandas pendientes en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
