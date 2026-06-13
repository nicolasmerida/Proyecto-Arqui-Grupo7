// app/ui/admin/StockAlerts.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useState, useCallback } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { useStompClient } from "@/app/lib/hooks/useStompClient";

interface StockAlertsProps {
    initialAlerts: Ingrediente[];
}

export default function StockAlerts({ initialAlerts }: StockAlertsProps) {
    const [alerts, setAlerts] = useState<Ingrediente[]>(initialAlerts);
    
    // Escuchar actualizaciones en tiempo real de ingredientes bajo stock
    const onMessageReceived = useCallback((nuevoIngrediente: Ingrediente) => {
        setAlerts((prevAlerts) => {
            const exists = prevAlerts.find((ing) => ing.idIngrediente === nuevoIngrediente.idIngrediente);
            if (exists) {
                // Actualizar valores del ingrediente si ya estaba en la lista de alertas
                return prevAlerts.map((ing) => 
                    ing.idIngrediente === nuevoIngrediente.idIngrediente ? nuevoIngrediente : ing
                );
            } else {
                // Agregar a la lista de alertas
                return [...prevAlerts, nuevoIngrediente];
            }
        });
    }, []);

    const { connected } = useStompClient<Ingrediente>('/topic/admin/stock', onMessageReceived);

    return (
        <div className="flex flex-col rounded-md mx-5 text-black bg-red-300 border-red-600 relative">
            {/* Indicador de conexión sutil */}
            {!connected && (
                <div className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" title="Desconectado del servidor de alertas"></span>
                </div>
            )}
            <div className="flex items-center gap-1 text-red-600 p-2 font-semibold">
                <HiOutlineInformationCircle className="text-lg" />Alertas de stock
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
                {/* Panel con alertas en grilla */}
                {alerts.length > 0 ? (
                    alerts.map((alert) => (
                        <div key={alert.idIngrediente} className="flex flex-col border border-red-400 bg-white/50 rounded-lg p-2">
                            <span className="font-semibold text-black">{alert.nombre}</span>
                            <span className="text-gray-600 text-sm">{alert.stock} {alert.unidad} • mínimo {alert.stockMinimo}</span>
                        </div>
                    ))
                ) : (
                    <span className="text-sm text-gray-700 italic">No hay alertas de stock bajo.</span>
                )}
            </div>
        </div>
    );
}