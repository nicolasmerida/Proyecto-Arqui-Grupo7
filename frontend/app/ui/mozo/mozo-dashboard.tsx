'use client';

import { useState } from "react";
import { Comanda, EstadoComanda } from "@/app/lib/definitions";
import CommandDetailCard from "@/app/ui/mozo/command-mozo";
import PlanoSalon from "@/app/ui/mozo/plano-salon";
import { useStompClient } from "@/app/lib/hooks/useStompClient";

const colorByState: Record<EstadoComanda, string> = {
  [EstadoComanda.Abierta]: "comanda-abierta",
  [EstadoComanda.Cancelada]: "comanda-cancelada",
  [EstadoComanda.Cerrada]: "comanda-cerrada",
  [EstadoComanda.Entregada]: "comanda-entregada",
  [EstadoComanda.Lista]: "comanda-lista",
  [EstadoComanda.Preparacion]: "comanda-preparacion",
};

interface MozoDashboardProps {
  initialComandas: Comanda[];
}

export default function MozoDashboard({ initialComandas }: MozoDashboardProps) {
  const [comandas, setComandas] = useState<Comanda[]>(initialComandas);

  // Escuchar actualizaciones en tiempo real de las comandas
  const { connected } = useStompClient<Comanda>('/topic/comanda', (updatedComanda) => {
    setComandas((prevComandas) => {
      const exists = prevComandas.find((c) => c.numeroComanda === updatedComanda.numeroComanda);
      if (exists) {
        // Actualizar la comanda existente
        return prevComandas.map((c) => 
          c.numeroComanda === updatedComanda.numeroComanda ? updatedComanda : c
        );
      } else {
        // Agregar nueva comanda
        return [...prevComandas, updatedComanda];
      }
    });
  });

  return (
    <div className="flex flex-row flex-1 items-start p-4 gap-6">
      {/* Indicador de conexión (Opcional, para debug visual o Premium UI) */}
      {!connected && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs shadow-lg animate-pulse">
          Desconectado del servidor...
        </div>
      )}
      
      <PlanoSalon />
      
      <div className="flex-col p-1 w-full max-w-md">
        <div className="flex flex-row justify-between content-center bg-gray-100 p-3 rounded-t-lg border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Comandas Activas</h2>
          <div className="flex items-center justify-center bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 shadow-sm">
            {comandas.length}
          </div>
        </div>
        
        <div className="flex flex-col py-2 gap-3 max-h-[80vh] overflow-y-auto pr-2">
          {comandas.length === 0 ? (
            <p className="text-gray-500 italic text-center mt-4">No hay comandas activas.</p>
          ) : (
            comandas.map((comanda) => (
              // Agregamos una key única
              <div 
                key={comanda.numeroComanda}
                className={`flex flex-col border-l-4 rounded-r-md shadow-sm bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] ${colorByState[comanda.estadoComanda]}`}
              >
                <CommandDetailCard command={comanda} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
