'use client';
import { ComandaDetalle, EstadoComanda, EstadoItem, Item_Pedido } from "@/app/lib/definitions";
import { HiOutlineCheck, HiPlay } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import Timer from "./timer";

type CommandProps = {
    command: ComandaDetalle;
}

export default function CommandCocinero({ command }: CommandProps) {
    const [optimisticItems, setOptimisticItems] = useState<Item_Pedido[]>(command.items || []);
    const [loading, setLoading] = useState(false);
    const [processingItems, setProcessingItems] = useState<Set<number>>(new Set());

    // Usamos refs para leer los estados dentro del effect sin añadirlos como dependencias
    // y evitar que el effect se dispare cuando loading pase a false (lo que causaba un sync con datos viejos)
    const loadingRef = useRef(loading);
    const processingSizeRef = useRef(processingItems.size);
    useEffect(() => { loadingRef.current = loading; }, [loading]);
    useEffect(() => { processingSizeRef.current = processingItems.size; }, [processingItems.size]);

    // Sincronizar el estado local cuando llegan datos del WebSocket
    useEffect(() => {
        // Solo copiamos los datos del WS si no estamos procesando nada localmente
        if (!loadingRef.current && processingSizeRef.current === 0) {
            setOptimisticItems(command.items || []);
        }
    }, [command.items]); // IMPORTANTE: Solo se ejecuta cuando llega un nuevo WS

    const items = [...optimisticItems].sort((a, b) => a.nombrePlato.localeCompare(b.nombrePlato));

    // Calcular estado global para pintar la tarjeta y definir el botón inferior
    const todosListos = items.length > 0 && items.every(i => i.estadoItem === EstadoItem.Listo || i.estadoItem === EstadoItem.Entregado);
    const tienePendientes = items.length > 0 && items.some(i => i.estadoItem === EstadoItem.Pendiente);

    let headerColor = "bg-gray-300 text-gray-800";
    if (todosListos) {
        headerColor = "bg-green-400 text-green-900";
    } else if (!tienePendientes) {
        headerColor = "bg-orange-400 text-orange-950";
    }

    const formatTime = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const cambiarEstadoItem = async (item: Item_Pedido, nuevo: EstadoItem) => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        return fetch(`${baseUrl}/api/items-pedido/${item.numeroComanda}/${item.idPlato}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nuevoEstado: nuevo })
        });
    };

    const cambiarEstadoComanda = async (nuevo: EstadoComanda) => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        return fetch(`${baseUrl}/api/comandas/${command.numeroComanda}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nuevoEstado: nuevo })
        });
    };

    const handleItemClick = async (item: Item_Pedido) => {
        if (processingItems.has(item.idPlato) || loading) return;

        let nuevoEstado = item.estadoItem;
        if (item.estadoItem === EstadoItem.Pendiente) nuevoEstado = EstadoItem.Preparacion;
        else if (item.estadoItem === EstadoItem.Preparacion) nuevoEstado = EstadoItem.Listo;

        if (nuevoEstado === item.estadoItem) return;

        setProcessingItems(prev => new Set(prev).add(item.idPlato));

        // Optimistic UI update: respuesta visual instantánea
        setOptimisticItems(prev => prev.map(i => i.idPlato === item.idPlato ? { ...i, estadoItem: nuevoEstado } : i));

        try {
            const response = await cambiarEstadoItem(item, nuevoEstado);
            if (!response.ok) {
                // Si la petición falla, revertimos el estado optimista leyendo del prop original
                setOptimisticItems(command.items || []);
                return;
            }
            if (nuevoEstado === EstadoItem.Preparacion && command.estadoComanda === EstadoComanda.Abierta) {
                await cambiarEstadoComanda(EstadoComanda.Preparacion);
            }
        } catch (e) {
            console.error("Error cambiando estado de item", e);
            setOptimisticItems(command.items || []);
        } finally {
            setProcessingItems(prev => {
                const next = new Set(prev);
                next.delete(item.idPlato);
                return next;
            });
        }
    };

    const handleGlobalAction = async () => {
        if (loading) return;
        setLoading(true);
        try {
            if (tienePendientes) {
                const pendientes = items.filter(i => i.estadoItem === EstadoItem.Pendiente);
                // Optimistic update global
                setOptimisticItems(prev => prev.map(i => i.estadoItem === EstadoItem.Pendiente ? { ...i, estadoItem: EstadoItem.Preparacion } : i));

                // Peticiones secuenciales para evitar race conditions en el WebSocket del backend
                for (const i of pendientes) {
                    await cambiarEstadoItem(i, EstadoItem.Preparacion);
                }
                await cambiarEstadoComanda(EstadoComanda.Preparacion);
            } else if (!todosListos) {
                const noListos = items.filter(i => i.estadoItem !== EstadoItem.Listo && i.estadoItem !== EstadoItem.Entregado);
                setOptimisticItems(prev => prev.map(i => (i.estadoItem !== EstadoItem.Listo && i.estadoItem !== EstadoItem.Entregado) ? { ...i, estadoItem: EstadoItem.Listo } : i));

                for (const i of noListos) {
                    await cambiarEstadoItem(i, EstadoItem.Listo);
                }
            } else {
                await cambiarEstadoComanda(EstadoComanda.Lista);
            }
        } finally {
            setLoading(false);
        }
    };

    let globalBtnText = "Preparar todo";
    let globalBtnColor = "bg-green-300 hover:bg-green-400 text-green-900";
    if (todosListos) {
        globalBtnText = "Avisar al mozo y cerrar";
        globalBtnColor = "bg-blue-400 hover:bg-blue-500 text-white shadow-md";
    } else if (!tienePendientes) {
        globalBtnText = "Terminar todo";
        globalBtnColor = "bg-green-300 hover:bg-green-400 text-green-900";
    }

    // Calcula total comensales de la mesa si está disponible, si no muestra un valor por defecto o guión
    const comensales = command.comensales || command.mesa?.capacidad || "-";
    const mozoNombre = "Mozo"; // TODO: Reemplazar cuando se agregue autenticación/relación

    return (
        <div className="flex flex-col bg-white rounded-md shadow-md border overflow-hidden w-full max-w-[480px] shrink-0">
            {/* Header */}
            <div className={`flex flex-col p-3 ${headerColor} transition-colors duration-300`}>
                <div className="flex justify-between items-center mb-2 h-7">
                    <Timer inicio={command.fecha} isListo={todosListos} />
                    <span suppressHydrationWarning className="font-semibold text-sm opacity-80 ml-auto">{formatTime(command.fecha)}</span>
                </div>
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold leading-none mb-1">Mesa {command.mesa?.numeroMesa}</h2>
                        <span className="text-xs opacity-75 mt-1">#{command.numeroComanda}</span>
                    </div>
                    <div className="flex flex-col items-end text-sm font-medium">
                        <span className="mb-1">{mozoNombre}</span>
                        <div className="flex items-center gap-1 opacity-90">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            <span>{comensales}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="flex flex-col p-3 gap-3 bg-white min-h-[100px]">
                {items.map(item => {
                    const isListo = item.estadoItem === EstadoItem.Listo || item.estadoItem === EstadoItem.Entregado;

                    return (
                        <div key={`${item.numeroComanda}-${item.idPlato}`} className="flex flex-row items-center justify-between border-b pb-3 last:border-0 last:pb-0 gap-2">
                            {/* Columna Texto */}
                            <div className="flex flex-col flex-1 min-w-0 pr-2">
                                <div className="flex flex-row items-start gap-3">
                                    <span className="font-bold text-gray-700 text-lg w-4 shrink-0">{item.cantidad}</span>
                                    <span className={`font-medium text-base leading-snug ${isListo ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                        {item.nombrePlato}
                                    </span>
                                </div>
                                {/* Condicional: Notas (sin click requerido) */}
                                {item.notas && (
                                    <span className="ml-7 mt-1 text-sm italic text-amber-600 font-medium leading-tight break-words">
                                        * {item.notas}
                                    </span>
                                )}
                            </div>

                            {/* Botón Estado Único */}
                            <button
                                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-semibold transition-colors disabled:cursor-not-allowed ${isListo
                                    ? "bg-green-50 border-green-200 text-green-600"
                                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                                    }`}
                                onClick={() => handleItemClick(item)}
                                disabled={processingItems.has(item.idPlato) || loading || isListo}
                            >
                                {item.estadoItem === EstadoItem.Pendiente && (
                                    <>Pendiente <HiPlay className="text-gray-400 ml-1" /></>
                                )}
                                {item.estadoItem === EstadoItem.Preparacion && (
                                    <>En preparación <HiPlay className="text-orange-500 ml-1" /></>
                                )}
                                {isListo && (
                                    <>Terminado <div className="bg-green-400 text-white rounded-full p-0.5 ml-1"><HiOutlineCheck className="w-3 h-3 stroke-2" /></div></>
                                )}
                            </button>
                        </div>
                    )
                })}
                {items.length === 0 && (
                    <span className="text-gray-400 text-center italic text-sm py-4">No hay ítems en la comanda</span>
                )}
            </div>

            {/* Bottom Button */}
            <div className="p-3 bg-white">
                <button
                    className={`w-full py-3 rounded-md font-bold text-lg shadow-sm transition-colors ${globalBtnColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={handleGlobalAction}
                    disabled={loading || items.length === 0}
                >
                    {loading ? "Procesando..." : globalBtnText}
                </button>
            </div>
        </div>
    );
}