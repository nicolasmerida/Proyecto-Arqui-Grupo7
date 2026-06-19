// app/ui/Cocinero/command-cocinero.tsx
'use client';
import { ComandaDetalle, EstadoComanda, EstadoItem, Item_Pedido } from "@/app/lib/definitions";
import { HiOutlineArrowSmRight, HiOutlineCheck, HiOutlineClock, HiOutlineX } from "react-icons/hi";

import { useSession } from "next-auth/react";

type CommandProps = {
    command: ComandaDetalle;
    state?: EstadoComanda;
    lastUpdate?: number;
}

export default function CommandCocinero({ command, state, lastUpdate }: CommandProps) {
    const items = command.items || [];
    const { data: session } = useSession();

    const sortedItems = [...items].sort((a, b) => a.idPlato - b.idPlato);

    // Calcula el estado siguiente lógico para el item
    const obtenerSiguienteEstado = (actual: EstadoItem) => {
        if (actual === EstadoItem.Pendiente) return EstadoItem.Preparacion;
        if (actual === EstadoItem.Preparacion) return EstadoItem.Listo;
        return actual;
    };

    // Cambia el estado de un item de la comanda
    const cambiarEstado = async (item: Item_Pedido, nuevo: EstadoItem) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
            const response = await fetch(`${baseUrl}/api/items-pedido/${item.numeroComanda}/${item.idPlato}/estado`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": session?.user?.id as string,
                },
                body: JSON.stringify({
                    nuevoEstado: nuevo
                })
            });

            if (!response.ok) {
                console.error("Error al cambiar de estado:", response.status);
                return;
            }
        } catch (error) {
            console.error("Fallo la petición:", error);
        }
    }

    return (
        <div className="flex flex-col rounded-md border p-3 bg-white shadow-sm border-gray-300">
            <div className="flex flex-row justify-between mb-2">
                <div className="flex flex-row gap-2 items-baseline">
                    <h1 className="text-xl font-bold text-gray-900">Mesa {command?.mesa?.numeroMesa}</h1>
                    <span className="text-sm font-semibold text-gray-600">#{command?.numeroComanda}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 font-medium">
                    <HiOutlineClock className="text-lg" />
                    {/* Tiempo activa */}
                </div>
            </div>
            <div className="flex flex-col rounded-md gap-3 mt-2">
                {
                    sortedItems.map((item) => (
                        <div key={`${item.numeroComanda}-${item.idPlato}`} className="flex flex-row items-center justify-between p-3 border border-gray-200 rounded-lg gap-3 bg-gray-50 shadow-sm">
                            <div className="flex flex-col flex-1 gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full flex items-center justify-center w-7 h-7 shrink-0 bg-gray-900 text-white text-sm font-bold shadow-sm">{item.cantidad}</div>
                                    <span className="text-gray-900 text-base font-semibold line-clamp-2">{item.nombrePlato}</span>
                                </div>
                                {item.notas && item.notas.trim() !== "" && (
                                    <div
                                        className="text-sm text-gray-700 italic ml-9 bg-yellow-50 p-1.5 rounded border border-yellow-200 cursor-help"
                                        title={item.notas}
                                    >
                                        {"* "}{item.notas.length > 80 ? item.notas.substring(0, 80) + '...' : item.notas}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center">
                                <button
                                    className={`flex justify-center px-4 py-2 rounded-md font-bold text-sm shadow-sm transition-colors border ${item.estadoItem === EstadoItem.Pendiente ? 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200' :
                                        item.estadoItem === EstadoItem.Preparacion ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' :
                                            item.estadoItem === EstadoItem.Listo ? 'bg-green-100 text-green-800 border-green-200 opacity-70 cursor-not-allowed' :
                                                'bg-gray-200 text-gray-800 border-gray-300 opacity-70 cursor-not-allowed'
                                        }`}
                                    onClick={() => cambiarEstado(item, obtenerSiguienteEstado(item.estadoItem))}
                                    disabled={item.estadoItem === EstadoItem.Listo || item.estadoItem === EstadoItem.Entregado}
                                    title={item.estadoItem === EstadoItem.Listo || item.estadoItem === EstadoItem.Entregado ? "No se puede avanzar más" : "Avanzar estado"}
                                >
                                    {item.estadoItem === EstadoItem.Pendiente ? "En Preparación \u2192" :
                                        item.estadoItem === EstadoItem.Preparacion ? "Listo \u2192" :
                                            item.estadoItem === EstadoItem.Listo ? "Listo \u2713" :
                                                "Entregado"}
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}