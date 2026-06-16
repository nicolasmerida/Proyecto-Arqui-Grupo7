// app/ui/cocinero/cocinero-dashboard.tsx
'use client';
import { Comanda, EstadoComanda, Item_Pedido } from "@/app/lib/definitions";
import CommandCard from "@/app/ui/cocinero/command-cocinero";
import { useState, useCallback } from "react";
import { HiOutlineBell, HiOutlineCheck, HiOutlineFire } from "react-icons/hi";
import { useStompClient } from "@/app/lib/hooks/useStompClient";

const colorByState: Record<EstadoComanda, string> = {
  [EstadoComanda.Abierta]: "comanda-abierta",
  [EstadoComanda.Cancelada]: "comanda-cancelada",
  [EstadoComanda.Cerrada]: "comanda-cerrada",
  [EstadoComanda.Entregada]: "comanda-entregada",
  [EstadoComanda.Lista]: "comanda-lista",
  [EstadoComanda.Preparacion]: "comanda-preparacion",
}

interface CocineroDashboardProps {
  initialComandas: Comanda[];
}

export default function CocineroDashboard({ initialComandas }: CocineroDashboardProps) {
  const [comandas, setComandas] = useState<Comanda[]>(initialComandas);
  const [lastItemUpdate, setLastItemUpdate] = useState<number>(Date.now());

  // 1. Suscripción a cambios en COMANDAS (ej. cuando cambia a estado lista/preparacion)
  const onComandaReceived = useCallback((comanda: Comanda) => {
    setComandas((prev) => {
      const idx = prev.findIndex(c => c.numeroComanda === comanda.numeroComanda);
      if (idx >= 0) {
        const next = [...prev];
        // Si la comanda se cerró/canceló/entregó, podríamos quitarla de la vista de cocina
        if ([EstadoComanda.Cerrada, EstadoComanda.Cancelada, EstadoComanda.Entregada].includes(comanda.estadoComanda)) {
          return prev.filter(c => c.numeroComanda !== comanda.numeroComanda);
        }
        next[idx] = comanda;
        return next;
      } else {
        if ([EstadoComanda.Abierta, EstadoComanda.Preparacion, EstadoComanda.Lista].includes(comanda.estadoComanda)) {
          return [...prev, comanda];
        }
        return prev;
      }
    });
  }, []);

  // 2. Suscripción a nuevos ITEMS en comandas existentes
  const onItemReceived = useCallback((item: Item_Pedido) => {
    // Al recibir un nuevo item, forzamos a los hijos CommandCocinero a recargar sus items
    setLastItemUpdate(Date.now());

    // Si la comanda de este ítem no existe en nuestra vista, la agregamos para que aparezca la tarjeta
    if (item.comanda) {
      setComandas(prev => {
        if (!prev.some(c => c.numeroComanda === item.comanda.numeroComanda)) {
          // Casteamos a Comanda y asignamos un estado base para que TS compile y se renderice en la columna correcta
          const nuevaComanda = {
            ...item.comanda,
            estadoComanda: EstadoComanda.Abierta
          } as Comanda;
          return [...prev, nuevaComanda];
        }
        return prev;
      });
    }
  }, []);

  const { connected: connectedComandas } = useStompClient<Comanda>('/topic/comanda', onComandaReceived);
  const { connected: connectedCocina } = useStompClient<Item_Pedido>('/topic/cocina', onItemReceived);

  const connected = connectedComandas && connectedCocina;

  // Cambia el estado de una comanda optimísticamente y actualiza el backend
  const cambiarEstado = async (numero: number, nuevo: EstadoComanda) => {
    // Actualización optimista
    setComandas((prev) => prev.map(c => c.numeroComanda === numero ? { ...c, estadoComanda: nuevo } : c));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comandas/${numero}/estado?nuevoEstado=${nuevo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error(`Error al cambiar estado a ${nuevo}`);
      }
    } catch (error) {
      console.error(error);
      // Opcional: Revertir en caso de error o notificar al usuario
    }
  }

  const pendientes = comandas.filter((c) => c.estadoComanda === EstadoComanda.Abierta);
  const enPreparacion = comandas.filter((c) => c.estadoComanda === EstadoComanda.Preparacion);
  const listos = comandas.filter((c) => c.estadoComanda === EstadoComanda.Lista);

  return (
    <div className="flex flex-col flex-1 items-center justify-center relative">
      {/* Indicador de WebSockets */}
      {!connected && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-red-500 font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Desconectado
        </div>
      )}

      <div className="flex flex-row justify-around items-start w-full m-10 p-5 gap-4">

        {/* Columna: Pendientes */}
        <div className="flex-1 flex flex-col items-center rounded-sm px-2 comanda-pendiente border-2 min-h-[50vh]">
          <h2 className="font-bold text-lg my-2 uppercase tracking-wide">Pendientes ({pendientes.length})</h2>
          <div className="flex flex-col py-1 w-full gap-4">
            {pendientes.map((comanda) => (
              <div key={comanda.numeroComanda} className={`flex flex-col border-y-4 ${colorByState[comanda.estadoComanda]} shadow-sm`}>
                <CommandCard command={comanda} state={comanda.estadoComanda} lastUpdate={lastItemUpdate} />
                <button
                  className="rounded-b-md py-2 flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 transition-colors text-orange-800 font-semibold"
                  onClick={() => cambiarEstado(comanda.numeroComanda, EstadoComanda.Preparacion)}
                >
                  <HiOutlineFire className="text-xl" /> Empezar a preparar
                </button>
              </div>
            ))}
            {pendientes.length === 0 && <span className="text-gray-500 italic self-center mt-4">No hay comandas pendientes</span>}
          </div>
        </div>

        {/* Columna: En Preparación */}
        <div className="flex-1 flex flex-col items-center rounded-sm px-2 comanda-preparacion border-2 min-h-[50vh]">
          <h2 className="font-bold text-lg my-2 uppercase tracking-wide">En Preparación ({enPreparacion.length})</h2>
          <div className="flex flex-col py-1 w-full gap-4">
            {enPreparacion.map((comanda) => (
              <div key={comanda.numeroComanda} className={`flex flex-col border-y-4 ${colorByState[comanda.estadoComanda]} shadow-sm`}>
                <CommandCard command={comanda} state={comanda.estadoComanda} lastUpdate={lastItemUpdate} />
                <button
                  className="rounded-b-md py-2 flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 transition-colors text-green-800 font-semibold"
                  onClick={() => cambiarEstado(comanda.numeroComanda, EstadoComanda.Lista)}
                >
                  <HiOutlineCheck className="text-xl" /> Todo listo
                </button>
              </div>
            ))}
            {enPreparacion.length === 0 && <span className="text-gray-500 italic self-center mt-4">Ninguna comanda en preparación</span>}
          </div>
        </div>

        {/* Columna: Listas */}
        <div className="flex-1 flex flex-col items-center rounded-sm px-2 comanda-lista border-2 min-h-[50vh]">
          <h2 className="font-bold text-lg my-2 uppercase tracking-wide">Listas ({listos.length})</h2>
          <div className="flex flex-col py-1 w-full gap-4">
            {listos.map((comanda) => (
              <div key={comanda.numeroComanda} className={`flex flex-col border-y-4 ${colorByState[comanda.estadoComanda]} shadow-sm`}>
                <CommandCard command={comanda} state={comanda.estadoComanda} lastUpdate={lastItemUpdate} />
                <div className="rounded-b-md py-2 flex items-center justify-center gap-2 bg-gray-100 text-gray-500 font-medium text-sm">
                  Esperando que el mozo lo retire...
                </div>
              </div>
            ))}
            {listos.length === 0 && <span className="text-gray-500 italic self-center mt-4">No hay comandas listas</span>}
          </div>
        </div>

      </div>
    </div>
  );
}
