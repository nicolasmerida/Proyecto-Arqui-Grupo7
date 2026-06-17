// app/ui/Cocinero/command-cocinero.tsx
'use client';
import { ComandaDetalle, EstadoComanda, EstadoItem, Item_Pedido } from "@/app/lib/definitions";
import { HiOutlineArrowSmRight, HiOutlineCheck, HiOutlineClock, HiOutlineX } from "react-icons/hi";

type CommandProps = {
    command: ComandaDetalle;
    state?: EstadoComanda;
    lastUpdate?: number;
}

export default function CommandCocinero({ command, state, lastUpdate }: CommandProps) {
    const items = command.items || [];

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
        <div className="flex flex-col rounded-md border p-2 bg-white/50">
            <div className="flex flex-row justify-between mb-1">
                <div className="flex flex-row gap-2 items-baseline">
                    <h1 className="text-lg font-bold text-black">Mesa {command?.mesa?.numeroMesa}</h1>
                    <span className="text-sm text-gray-500">#{command?.numeroComanda}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                    <HiOutlineClock />
                    {/* Tiempo activa */}
                </div>
            </div>
            <div className="flex flex-col rounded-md gap-2 mt-2">
                {
                    items.map((item) => (
                        <div key={`${item.numeroComanda}-${item.idPlato}`} className="flex flex-row items-center justify-between p-2 border rounded-md gap-3 bg-gray-50">
                            <div className="flex items-center gap-2 flex-1">
                                <div className="rounded-full flex items-center justify-center w-6 h-6 shrink-0 bg-black text-white text-xs font-bold">{item.cantidad}</div>
                                <span className="text-black text-sm font-medium line-clamp-2">{item.nombrePlato}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 uppercase font-semibold">{item.estadoItem}</span>
                                <button
                                    className="flex justify-center p-1.5 rounded-md border hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    onClick={() => cambiarEstado(item, obtenerSiguienteEstado(item.estadoItem))}
                                    disabled={item.estadoItem === EstadoItem.Listo || item.estadoItem === EstadoItem.Entregado}
                                    title="Avanzar estado"
                                >
                                    {(item.estadoItem === EstadoItem.Pendiente) ? <HiOutlineArrowSmRight className="text-blue-500 text-lg" /> : (
                                        (item.estadoItem === EstadoItem.Preparacion) ? <HiOutlineCheck className="text-green-500 text-lg" /> : (
                                            (item.estadoItem === EstadoItem.Listo) ? <HiOutlineArrowSmRight className="text-gray-500 text-lg" /> : <HiOutlineX className="text-red-500 text-lg" />
                                        ))
                                    }
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}